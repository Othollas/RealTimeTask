import express from 'express';
import Task from '../schemas/taskSchema.js';
import { ObjectId } from "mongodb";
import verifyToken from '../function.js';


const router = express.Router();



router.get("/:id", verifyToken, async (req, res) => {

    try {
        
        if (req.user) {
            const tasks = await Task.find({ category_id: req.params.id });
            res.json({ tasks, source: "db" });
        }else{
            res.json({source: "Guest"})
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur Serveur" });
    }
})

router.post("/", async (req, res) => {


    try {
        const { title, description, id_category } = req.body;


        if (!title) {
            return res.status(400).json({ message: "Le nom est obligatoire" })
        }

        const newTask = {
            title: title,
            description: description != '' ? description : null,
            category_id: new ObjectId(id_category),
            created_at: new Date(),
            updated_at: new Date(),
        }

        const result = await Task.insertOne(newTask)

        res.status(201).json(result);

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})

router.delete("/:id", async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID invalide' });
        };
        const id = new ObjectId(req.params.id);

        const result = await Task.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        };

        res.json({
            message: 'Tâche supprimée avec succès',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: err.message })
    };
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, created_at } = req.body;

        const newData = {
            title: title,
            description: description == '' ? null : description,
            created_at: new Date(created_at),
            updated_at: new Date()
        };

        const result = await Task.updateOne({ _id: new ObjectId(id) }, newData);

        if (!result.acknowledged) {
            return res.status(404).json({ message: "tache non trouvé" })
        };

        res.json({
            message: "Bravo tu as reussi",
            modificatedCount: result.modifiedCount
        });

    } catch (err) {
        res.status(500).json({ message: err.message })
    };
});

export default router;