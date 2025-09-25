import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { WebSocketServer } from "ws";
import * as cookie from "cookie";

import { connectDB } from "./db.js";
import categoriesRouter from "./routes/categories.js";
import tasksRouter from "./routes/tasks.js";
import authRouter from "./routes/auth.js";
import verifyToken, { verifyTokenWS } from "./function.js";
import group from "./routes/group.js";

const app = express();
const PORT = 3001;
// const wss = new WebSocketServer({ port : 8080 });

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/categories/", categoriesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);
app.use("/api/group", group);


// je crée le serveur HTTP autour d'express

const server = http.createServer(app);

// J'attache le WS au même serveur 
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws, request, user) => {
    console.log(user)
    ws.user = user; // J'attache info user
    console.log('Nouvelle connexion WS sécurisé', user.id);

    ws.on('message', (data) => {
        const msg = JSON.parse(data);
        console.log('Message WS reçu:', msg);
        
        // exemple broadcast à tous les clients y compris l'envoyer (si jamais on ne voulais envoyer à l'envoyer on aurais du mettre : if (client.readyState === WebSocket.OPEN && client !== ws) )
        wss.clients.forEach(client => {
            client.send(JSON.stringify(msg));
        })
    });
});

// Ensuite je gere l'upgrade http -> ws pour lire le cookie

server.on("upgrade", (request, socket, head)=> {
    const cookies = request.headers.cookie;

    const parsed = cookie.parse(cookies || "");
        
    const token = parsed.authToken;
    console.log(token)

    if (!token) {
        socket.destroy(); // ici pas de token -> connexion refusé 
        return;
    }

    const user = verifyTokenWS(token); // retoune {_id, username, ... } ou null 
    if(!user){
        socket.destroy() // le token est ici invalide
        return;
    }

    // Si on arrive ici c'est que la connection ws est autorisée

    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request, user);
    })
})


connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server (HTTP + WS) is running on http://localhost:${PORT}`);
    });
});
