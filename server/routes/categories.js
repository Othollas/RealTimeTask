import express from "express";
import { getDB } from "../db.js";


const router = express.Router();
;

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
    try {
        const { name, description, owner } = req.body; // récuperation du post
        console.log(req.body);
        

        // validation
        if (!name) {
            return res.status(400).json({ message: "Le nom est obligatoire" })
        }

        const newCategorie = {
            name, 
            description, 
            owner: owner || null,
            created_at: new Date(),
            updated_at: new Date()
        };

        const result = await getDB().collection('categories').insertOne(newCategorie);
   
        
        //Response avec succes
       res.status(201).json(result);

    } catch (err) {
        //Gestion des erreurs 
        res.status(500).json({ message: err.message })
    }
})


export default router;