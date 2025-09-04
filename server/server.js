import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import categoriesRouter from "./routes/categories.js";
import tasksRouter from "./routes/tasks.js"
import authRouter from "./routes/auth.js"
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";

const app = express();
const wss = new WebSocketServer({ port : 8080 });

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use("/api/categories/", categoriesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);

const PORT = 3001;


wss.on('connection', (ws)=> {
    console.log('Nouvelle connexion');

    ws.on('message', (message)=>{
        console.log('Message reçu:', message.toString());
        ws.send(`Echo: ${message}`)
    });
});

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
