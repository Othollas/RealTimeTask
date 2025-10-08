/**
 * Authentification API Service
 * 
 * Rôle global :
 *  - Fournir des routes sécurisées pour gérer l'authentification des utilisateurs
 *  - Permettre la création de compte, la connexion, la vérification de session et la déconnexion
 *  - Utiliser bcrypt pour le hash des mots de passe et JWT pour la gestion de session
 * 
 * Routes principales :
 * 
 * 1. POST /register
 *    - Valide les champs reçus (username, email, password)
 *    - Hash le mot de passe avec bcrypt
 *    - Crée un nouvel utilisateur dans la base MongoDB
 *    - Renvoie les informations de l'utilisateur et un message de succès
 *    - Gère les erreurs spécifiques :
 *        - Duplication d'email ou pseudo
 *        - Erreur de validation de champ
 *        - Erreur serveur générale
 * 
 * 2. POST /login
 *    - Vérifie si l'email existe et si le mot de passe correspond
 *    - Génère un token JWT contenant id, username, email et groupe de l'utilisateur
 *    - Définit le cookie "authToken" pour la session avec des options sécurisées (httpOnly, sameSite, maxAge)
 *    - Renvoie un message de succès ou d'échec selon l'authentification
 * 
 * 3. GET /me
 *    - Vérifie la présence du cookie "authToken"
 *    - Décode le JWT pour récupérer les informations utilisateur
 *    - Renvoie l'état de connexion et les informations utilisateur si valides
 *    - Sinon, renvoie un statut 401 (non autorisé)
 * 
 * 4. POST /logout
 *    - Supprime le cookie "authToken"
 *    - Renvoie un message de confirmation de déconnexion
 * 
 * Sécurité et mémoire :
 *  - Les mots de passe ne sont jamais stockés en clair
 *  - Les tokens JWT contiennent uniquement les informations nécessaires pour l'identification
 *  - Les cookies httpOnly protègent contre les attaques XSS
 * 
 * TODO / FIXME :
 *  - Ajouter une validation plus stricte des champs côté serveur
 *  - Ajouter gestion de token expiré côté client pour rediriger vers login
 *  - Ajouter journalisation ou alertes pour tentatives de connexion suspectes
 *  - Sécuriser le cookie en production (secure: true) et configurer le domaine
 * 
 * Usage typique :
 *  - POST /register avec {username, email, password} pour créer un compte
 *  - POST /login avec {email, password} pour obtenir un cookie JWT
 *  - GET /me pour vérifier l'état de connexion
 *  - POST /logout pour détruire la session
 */


import express, { Router } from "express";
import bcrypt from "bcrypt"
import User from "../schemas/userSchema.js";
import jwt from "jsonwebtoken";
import 'dotenv/config'


const router = express.Router();


const generateToken = (userId, pseudo, userEmail, userGroup) => {
    return jwt.sign({ id: userId, username: pseudo, email: userEmail, group : userGroup }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};

router.post("/register", async (req, res) => {

    try {
        const is_valid = req.body.username != '' && req.body.email.length > 6 && req.body.password.length > 6;
        if (!is_valid) { return res.status(400).json({ message: 'Erreur de champ' }) };
        const { username, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashPassword,
            created_at: new Date(),
            updated_at: new Date(),
        }

        const createdUser = await User.create(newUser);



        res.status(201).json({
            id: createdUser._id,
            username: createdUser.username,
            email: createdUser.email,
            message: "utilisateur crée",
            ok: true
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email ou Pseudo déja utilisé" })
        }
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message })
        }
        console.error(err);
        res.status(500).json({ message: "Erreur server" })
    }
});


router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        const searchEmail = email.toLowerCase();

        const response = await User.findOne({ email: searchEmail });
       
        if (!response || !(await bcrypt.compare(password, response.password))) {return res.status(401).json({ message: "Identifiant invalide", find: false}) }

        console.log("groupe de l'user", response.groups)
        // if(response.groups) {console.log(response.groups)}

        // on Genere le token qui 


        const token = generateToken(response._id, response.username, response.email, response.groups);

        const isGroup = response.groups ? true : false;

        res.status(201).cookie("authToken", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "Strict",
            maxAge: 3600000,
        }).json({ message: "Identifiant valide", find: true, group: isGroup})



    } catch (error) {
        console.error(error)
    }

})

router.get("/me", (req, res) => {
    const token = req.cookies.authToken;
    if(!token) return res.status(401).json({ loggedIn: false });

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ loggedIn: true, user });
    }catch{
        res.status(401).json({ loggedIn: false });
    }
});


router.post("/logout", (req, res)=>{
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict"
    });
    res.status(200).json({ message: "Utilisateur déconnecté" });
})

export default router;