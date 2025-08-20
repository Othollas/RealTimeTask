import express from "express";
import { getDB } from "../db.js";
import { ObjectId } from "mongodb";

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


        // validation
        if (!name) {
            return res.status(400).json({ message: "Le nom est obligatoire" })
        }


        const newCategorie = {
            name,
            description: description === '' ? null : description,
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

router.delete("/:id", async (req, res) => {
    try {
        // Vérification que l'ID est valide
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID invalide' });
        }

        const result = await getDB()
            .collection('categories')
            .deleteOne({ _id: new ObjectId(req.params.id) });

        console.log('Résultat suppression:', result);
        // Vérification avec deletedCount
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        res.json({
            message: 'Catégorie supprimée avec succès',
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, owner, created_at } = req.body;
        const updatedTime = new Date();

        console.log(name, description, Date(created_at), req.params.id);
        const updatedCategorie = {
            name: name,
            description: description == '' ? null : description,
            owner: owner || null,
            created_at: new Date(created_at),
            updated_at: updatedTime
        };

        console.log(updatedCategorie)
        const result = await getDB().collection('categories').replaceOne({ _id: new ObjectId(req.params.id) }, updatedCategorie);

        if (!result.acknowledged) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        };

        res.json({
            message: 'Categorie modifié avec succés',
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message })
    };
});

export default router;