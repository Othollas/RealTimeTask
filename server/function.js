/**
 * Auth / Token Service
 * 
 * Rôle global :
 *  - Fournir des fonctions pour générer des identifiants uniques et vérifier les JWT
 *  - Permettre de sécuriser les routes Express et WebSocket en validant le token d'authentification
 * 
 * Fonctionnalités principales :
 * 1. generateId()
 *    - Génère un identifiant unique basé sur l'heure actuelle et un nombre aléatoire
 *    - Retourne une chaîne de caractères pouvant être utilisée comme ID pour les objets temporaires (ex: tâches ou catégories)
 * 
 * 2. verifyToken(req, res, next)
 *    - Middleware Express qui récupère le token JWT depuis les cookies (`authToken`)
 *    - Si le token est absent ou invalide, `req.user` est défini sur `null`
 *    - Sinon, décode le token et attache l'objet `user` à `req.user`
 *    - Appelle `next()` pour continuer le traitement de la requête
 * 
 * 3. verifyTokenWS(token)
 *    - Vérifie et décode un token JWT pour un usage WebSocket
 *    - Retourne l'objet `user` si le token est valide, sinon `null`
 * 
 * Comportement mémoire :
 *  - Les tokens JWT ne sont pas stockés côté serveur : seule la vérification est effectuée à la demande
 *  - Les objets `user` décodés sont passés via `req.user` ou retournés, pas conservés globalement
 * 
 * Usage typique :
 *  import verifyToken, { generateId, verifyTokenWS } from './function.js';
 *  
 *  // Express route
 *  router.get("/private", verifyToken, (req, res) => {
 *      if (!req.user) return res.status(401).json({ message: "Non autorisé" });
 *      res.json({ user: req.user });
 *  });
 * 
 *  // Génération d'un ID unique
 *  const id = generateId();
 * 
 *  // Vérification pour WebSocket
 *  const user = verifyTokenWS(token);
 * 
 * TODO / FIXME :
 *  - Ajouter expiration et rafraîchissement automatique du token si nécessaire
 *  - Valider la structure du token avant d’appeler jwt.verify pour réduire les erreurs
 */


import jwt from "jsonwebtoken";
import 'dotenv/config'

export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString().substring(2, 9)
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    });
};


export const verifyTokenWS = (token) =>{
    try{
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return null;
    }
};

export default verifyToken;