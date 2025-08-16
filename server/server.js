const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


//Route GET simple 
app.get('/', (req, res) => {
    res.send('Bonjour tous le monde !');
});


app.get('/bonjour', (req, res) => {
    res.send('Hello mina')
});

// Route GET avec Récuperation de donnée

app.get('/utilisateur/:nom', (req, res) => {
    const nomUtilisateur = req.params.nom;
    res.send(`Bonjour ${nomUtilisateur}`)
})



// Route TEST POST 
app.post('/contact', (req, res) =>{
    const {nom, email} = req.body;
    console.log(`Nouveau contact : ${nom}, (${email})`);
    res.json({ status: `Message reçu !` });
});

// connexion MongoDB
// mongoose.connect("mongodb://lcoalhost:27017/todo_realtime", {
    
//     useUnifiedTopology: true
// }).then(()=> console.log('MongoDB connecté'))
// .catch(err => console.error(err));

//lancement du serveur HTTP
const server = app.listen(PORT, ()=>{
    console.log(`Serveur HTTP sur http:localhost:${PORT}`)
})