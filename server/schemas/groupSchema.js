/**
 * Group Schema (Mongoose)
 * 
 * Rôle global :
 *  - Définir la structure et les contraintes d'un groupe dans la base MongoDB
 *  - Fournir un modèle utilisable pour les opérations CRUD via Mongoose
 * 
 * Champs principaux :
 *  - group_name : nom unique du groupe, obligatoire, longueur 1-255 caractères
 *  - id_admin : référence à un document User représentant l'administrateur, obligatoire
 *  - created_at : date de création, obligatoire, valeur par défaut la date actuelle
 *  - updated_at : date de dernière modification, obligatoire, valeur par défaut la date actuelle
 * 
 * Fonctionnalités :
 *  - Les validations intégrées (required, unique, maxlength, minlength) assurent la cohérence des données
 *  - Le champ id_admin permet d'associer un administrateur à chaque groupe
 *  - Le modèle `Group` peut être utilisé pour créer, lire, mettre à jour ou supprimer des groupes dans MongoDB
 * 
 * Usage typique :
 *  import Group from "../schemas/groupSchema.js";
 *  const newGroup = await Group.create({ group_name: "Admins", id_admin: someUserId });
 *  const groups = await Group.find();
 * 
 * TODO / FIXME :
 *  - Ajouter un hook `pre-save` pour mettre à jour `updated_at` automatiquement
 *  - Ajouter des index si nécessaire pour les recherches fréquentes sur `group_name`
 */


import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    group_name : {
        type: String,
        required: true,
        minlength : 1,
        maxlength: 255,
        unique: true,
    },
    id_admin: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "User"
    },
    created_at:{
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Group = mongoose.model("Group", groupSchema, "groups-test");
export default Group;