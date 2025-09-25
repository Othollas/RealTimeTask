import express from "express";
import { ObjectId } from "mongodb";
import Category from "../schemas/categorieSchema.js";
import verifyToken, {generateId} from "../function.js";

const router = express.Router();


router.get("/", verifyToken, async (req, res) => {
    try {

        
        const categories = await Category.find();

        if (req.user) {
            res.json({ categories: categories, username: req.user.username, source: "db" });
        } else {
            res.json({ categories: categories, username: "Invité", source: "Guest" });
        }


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur Serveur" });
    }
});


router.post("/", verifyToken, async (req, res) => {
    try {

        const { name, description, owner } = req.body; // récuperation du post


        // validation
        if (!name) {
            return res.status(400).json({ message: "Le nom est obligatoire" })
        }

        const tempCategorie = {
            name,
            description: description === '' ? null : description,
            owner: owner || null,
            created_at: new Date(),
            updated_at: new Date()
        };

        if (req.user) {
            const result = await Category.insertOne(tempCategorie);
            res.status(201).json({result, source: "db"});
        }

        if (!req.user) {
           const newCategorie = { _id: generateId(), ...tempCategorie};
            return res.json({newCategorie, source: "Guest" });
        }

    } catch (err) {
        //Gestion des erreurs 
        res.status(500).json({ message: err.message })
    }
})

router.delete("/:id", verifyToken, async (req, res) => {
    try {

        if (req.user) {
            // Vérification que l'ID est valide
            if (!ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'ID invalide' });
            }
            const deletedCategorie = await Category.findOne({ _id: new ObjectId(req.params.id )})
            const result = await Category.deleteOne({ _id: new ObjectId(req.params.id) });

            console.log('Résultat suppression:', result);
            // Vérification avec deletedCount
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }

            res.json({
                message: 'Catégorie supprimée avec succès',
                deletedCount: result.deletedCount,
                source: "db",
                deletedCategory : deletedCategorie
            });
        } else {
            res.json({ source: "Guest" })
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put("/:id", verifyToken, async (req, res) => {
    try {


        const { name, description, owner, created_at } = req.body;

        const updatedTime = new Date();


        const updatedCategorie = {
            _id: req.params.id,
            name: name,
            description: description == '' ? null : description,
            owner: owner || null,
            created_at: new Date(created_at),
            updated_at: updatedTime
        };

        if (req.user) {
            const oldCategory = await Category.findOne({ _id :  new ObjectId(req.params.id)});
            const result = await Category.replaceOne({ _id: new ObjectId(req.params.id) }, updatedCategorie);

            if (!result.acknowledged) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            };

            res.json({
                message: 'Categorie modifié avec succés',
                oldName: oldCategory.name,
                updatedCategory: updatedCategorie,
                modifiedCount: result.modifiedCount
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    };
});

export default router;