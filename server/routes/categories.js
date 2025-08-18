import express from "express";
import { getDB } from "../db.js";

const router = express.Router();

router.get("/", async (req, res)=>{
    try {
        const categories = await getDB()
        .collection('categories')
        .find()
        .toArray();
        res.json(categories);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Erreur Serveur" });
    }
});

router.post("/", async (req, res)=>{
    try {
        const {name, description = null} = req.body; // récuperation du post

        // validation
if(!name) {
    return res.status(400).json({message: "Le nom est obligatoire"})
}

// creation de la categorie
const nouvelleCategorie = {name, category};


    } catch (err) {
        
    }
})


export default router;