/**
 * MongoDB Connection Service
 * 
 * Rôle global :
 *  - Gérer la connexion à la base de données MongoDB pour l'application
 *  - Fournir un accès centralisé à l'objet `db` pour les opérations CRUD
 *  - Permettre l'utilisation soit du client natif MongoDB (`MongoClient`), soit de Mongoose
 * 
 * Fonctionnalités principales :
 * 1. connectDB()
 *    - Utilise Mongoose pour se connecter à la base `taskApp` sur `mongodb://localhost:27017`
 *    - Affiche un message de confirmation si la connexion réussit
 *    - Intercepte et affiche les erreurs de connexion, puis termine le processus en cas d'échec
 *    - Stocke l'objet de connexion dans la variable `db` pour réutilisation
 * 
 * 2. getDB()
 *    - Retourne l'objet de connexion Mongoose stocké dans `db`
 *    - Permet à d'autres modules d'accéder à la connexion sans recréer une nouvelle instance
 * 
 * Comportement mémoire :
 *  - Une seule instance de connexion est maintenue en mémoire dans `db`
 *  - Permet de partager la même connexion à toute l'application, évitant les multiples connexions simultanées
 * 
 * Usage typique :
 *  import { connectDB, getDB } from './db.js';
 *  await connectDB();
 *  const db = getDB(); // récupérer la connexion Mongoose
 * 
 * TODO / FIXME :
 *  - Harmoniser l'utilisation : supprimer le code MongoClient natif si Mongoose est choisi
 *  - Ajouter un gestionnaire de reconnexion automatique en cas de perte de connexion
 */


import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "taskApp";

let db;

// export async function connectDB() {
//     await client.connect();
//     db = client.db(dbName);
//     console.log("MongoDB connected", dbName);
// };

export const connectDB = async () => {
  try {
   db = await mongoose.connect(`mongodb://localhost:27017/taskApp`);
    console.log("MongoDB connecté avec Mongoose");
  } catch (err) {
    console.error("Erreur MongoDB :", err);
    process.exit(1);
  }
};



export function getDB(){
    return db;
};