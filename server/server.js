import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import categoriesRouter from "./routes/categories.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));


app.use("api/categories", categoriesRouter);

const PORT = 3001;

app.post("/contact", (req, res) => {
    console.log(req.body);
    const {name, email} = req.body;
    console.log(`nouvel utilisateur ${name} qui à pour email ${email}`);
    // res.json({ status: "Message reçu"})
    res.redirect("http://localhost:5173")
})

app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

// connexion MongoDB
// mongoose.connect("mongodb://lcoalhost:27017/todo_realtime", {
    
//     useUnifiedTopology: true
// }).then(()=> console.log('MongoDB connecté'))
// .catch(err => console.error(err));

//lancement du serveur HTTP
// const server = app.listen(PORT, ()=>{
//     console.log(`Serveur HTTP sur http:localhost:${PORT}`)
// })