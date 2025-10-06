/**
 * Group API Service
 * 
 * Rôle global :
 *  - Fournir une route pour récupérer les informations d'un groupe et ses membres
 *  - Utiliser `verifyToken` pour sécuriser l'accès aux données
 *  - Interroger la base MongoDB via Mongoose pour récupérer les relations entre Users et Groups
 * 
 * Route principale :
 * 
 * 1. GET /
 *    - Vérifie que l'utilisateur est authentifié (via `verifyToken`)
 *    - Récupère l'utilisateur courant depuis la base MongoDB
 *    - Utilise `.populate("groups")` pour remplir les informations du groupe lié à cet utilisateur
 *    - Récupère tous les utilisateurs appartenant à ce groupe (`User.find({ groups: ... })`)
 *    - Renvoie un objet JSON contenant :
 *        - `titre_groupe` : nom du groupe de l'utilisateur courant
 *        - `nom_groupe` : liste des utilisateurs du même groupe
 * 
 * Sécurité et mémoire :
 *  - Route protégée via JWT et `verifyToken`
 *  - Population Mongoose permet d'éviter des requêtes manuelles multiples pour récupérer les infos de groupe
 * 
 * TODO / FIXME :
 *  - Limiter les champs retournés pour les utilisateurs afin de ne pas exposer toutes les données
 *  - Ajouter gestion d'erreurs plus précise et renvoyer des statuts HTTP appropriés
 *  - Gérer le cas où l'utilisateur n'appartient à aucun groupe
 * 
 * Usage typique :
 *  GET /groups → récupère le groupe et ses membres pour l'utilisateur connecté
 */



import express from "express";
import verifyToken from "../function.js";
import User from "../schemas/userSchema.js";
import mongoose from "mongoose";
import Group from "../schemas/groupSchema.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {

    try {
        // ici le populate prend en compte la clé groups dans le schema User et non le schema Group
        const titleGroup = await User.findById(req.user.id).populate("groups");

        // Ici je récupere toute les données des users, à termes, n'envoyer que les champs nécessaire
        const usersGroup = await User.find({ groups: titleGroup.groups._id });

        res.json({ titre_groupe: titleGroup.groups.group_name, nom_groupe: usersGroup });
    } catch (error) {
        console.error(error)
    }


})




export default router;