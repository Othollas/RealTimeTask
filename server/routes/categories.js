import express from "express";
import { getDB } from "../db.js";

const router = express.Router();

router.get("/", async (req, res)=>{
    try {
        const categories = await getDB()
        .collection('categories')
        .find({})
        .toArray();
        res.json(categories);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Erreur Serveur" });
    }
});


export default router;