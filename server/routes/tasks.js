
/**
 * Task API Service
 * 
 * Rôle global :
 *  - Gérer les opérations CRUD sur les tâches (Tasks) liées aux catégories
 *  - Utiliser `verifyToken` pour sécuriser l'accès aux données utilisateur
 *  - Fournir des comportements différents selon que l'utilisateur est connecté ou invité (Guest)
 * 
 * Routes principales :
 * 
 * 1. GET /:id
 *    - Récupère toutes les tâches d'une catégorie spécifique (via l'ID)
 *    - Si utilisateur connecté : recherche en base MongoDB
 *    - Si utilisateur invité : renvoie juste { source: "Guest" }
 * 
 * 2. POST /
 *    - Crée une nouvelle tâche
 *    - Validation : le champ `title` est obligatoire
 *    - Si utilisateur connecté : insère dans MongoDB et associe à `id_category`
 *    - Si utilisateur invité : génère une tâche locale avec un `_id` temporaire via `generateId()`
 * 
 * 3. DELETE /:id
 *    - Supprime une tâche via son ID
 *    - Vérifie que l'ID est valide
 *    - Si utilisateur connecté : suppression dans MongoDB
 *    - Renvoie un message de succès et les données de la tâche supprimée
 * 
 * 4. PUT /:id
 *    - Met à jour une tâche existante
 *    - Validation de l'ID et des champs
 *    - Si utilisateur connecté : met à jour MongoDB et renvoie l'ancienne et nouvelle version de la tâche
 * 
 * Sécurité et mémoire :
 *  - Toutes les routes sensibles sont protégées via JWT (`verifyToken`)
 *  - Les objets temporaires pour les utilisateurs invités sont générés côté serveur mais non persistés
 *  - Les erreurs serveur sont capturées et renvoyées avec le status HTTP approprié
 * 
 * TODO / FIXME :
 *  - Gérer les invités pour DELETE et PUT ou renvoyer une erreur claire
 *  - Standardiser les noms des champs (`modificatedCount` → `modifiedCount`)
 *  - Ajouter des logs plus détaillés pour le suivi des modifications
 * 
 * Usage typique :
 *  GET /tasks/:id → récupère les tâches d’une catégorie
 *  POST /tasks → crée une tâche
 *  PUT /tasks/:id → met à jour une tâche
 *  DELETE /tasks/:id → supprime une tâche
 */

import express from 'express';
import Task from '../schemas/taskSchema.js';
import Category from "../schemas/categorieSchema.js";
import { ObjectId } from "mongodb";
import verifyToken, { generateId } from '../function.js';


const router = express.Router();



router.get("/:id", verifyToken, async (req, res) => {

    try {

        if (req.user) {
            const tasks = await Task.find({ category_id: req.params.id });
            res.json({ tasks: tasks, source: "db" });
        } else {
            res.json({ source: "Guest" })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur Serveur" });
    }
})

router.post("/", verifyToken, async (req, res) => {
    try {
        const { title, description, id_category } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Le nom est obligatoire" })
        }

        if (req.user) {

            const newTask = {
                title: title,
                description: description != '' ? description : null,
                category_id: new ObjectId(id_category),
                created_at: new Date(),
                updated_at: new Date(),
            }

            
            const result = await Task.insertOne(newTask);
            res.status(201).json({ result, source: "db" });
        } else {
            const newTask = {
                _id: generateId(),
                title: title,
                description: description != '' ? description : null,
                category_id: id_category,
                created_at: new Date(),
                updated_at: new Date(),
                completed: false,
                recovery_time: null,
                point: null
            }
            res.json({ newTask });
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }

})

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        
        if (req.user) {

            if (!ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ message: 'ID invalide' });
            };
            const id = new ObjectId(req.params.id);

            const taskToDelete = await Task.findOne({ _id: id })
            const result = await Task.deleteOne({ _id: id });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            };

            

            res.json({
                message: 'Tâche supprimée avec succès',
                deletedCount: result.deletedCount,
                deletedTask : taskToDelete
            });
        }

    } catch (error) {
        res.status(500).json({ message: err.message })
    };
});

router.put("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, created_at } = req.body;


        if (req.user) {
            const newData = {
                title: title,
                description: description == '' ? null : description,
                created_at: new Date(created_at),
                updated_at: new Date()
            };
            const oldData = await Task.findById({ _id: new ObjectId(id) }).lean();
            const result = await Task.updateOne({ _id: new ObjectId(id) }, newData);

            if (!result.acknowledged) {
                return res.status(404).json({ message: "tache non trouvé" })
            };
       
            res.json({
                message: "Bravo tu as reussi",
                modificatedCount: result.modifiedCount,
                updatedTask : {...oldData, title: newData.title, description: newData.description, created_at: newData.created_at, updated_at: newData.updated_at }
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    };
});

export default router;