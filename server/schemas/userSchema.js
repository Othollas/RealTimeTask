/**
 * User Schema (Mongoose)
 * 
 * Rôle global :
 *  - Définir la structure et les contraintes d'un utilisateur dans la base MongoDB
 *  - Fournir un modèle utilisable pour les opérations CRUD via Mongoose
 * 
 * Champs principaux :
 *  - username : nom d'utilisateur, obligatoire, unique, longueur 1-100 caractères
 *  - email : email de l'utilisateur, unique, longueur max 1000 caractères
 *  - password : mot de passe hashé, obligatoire, longueur max 1000 caractères
 *  - is_admin : booléen indiquant si l'utilisateur est administrateur, défaut false
 *  - created_at : date de création, obligatoire, valeur par défaut la date actuelle
 *  - updated_at : date de dernière modification, obligatoire, valeur par défaut la date actuelle
 *  - groups : référence à un document Group (permet de lier l'utilisateur à un groupe)
 * 
 * Fonctionnalités :
 *  - Les validations intégrées (required, minlength, maxlength, unique) assurent la cohérence des données
 *  - La relation `groups` permet d'associer l'utilisateur à un groupe pour gestion de permissions ou organisation
 *  - Le modèle `User` peut être utilisé pour créer, lire, mettre à jour ou supprimer des utilisateurs dans MongoDB
 * 
 * Usage typique :
 *  import User from "../schemas/userSchema.js";
 *  const newUser = await User.create({ username: "alice", email: "alice@mail.com", password: hashedPassword });
 *  const adminUsers = await User.find({ is_admin: true });
 * 
 * TODO / FIXME :
 *  - Ajouter un hook `pre-save` pour mettre à jour `updated_at` automatiquement lors des modifications
 *  - Ajouter une validation email plus stricte (regex) pour éviter les formats invalides
 *  - Étendre `groups` pour permettre plusieurs groupes par utilisateur si nécessaire
 */


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        unique: true
    },
    email: {
        type: String,
        maxlength: 1000,
        unique:true
    },
    password: {
        type: String,
        maxlength: 1000,
        required: true
    },
    is_admin: {
        type: Boolean,
        required: true,
        default: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
     groups: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Group"
    },
})

const User = mongoose.model("User", userSchema);
export default User;