/**
 * Task Schema (Mongoose)
 * 
 * Rôle global :
 *  - Définir la structure et les contraintes d'une tâche dans la base MongoDB
 *  - Fournir un modèle utilisable pour les opérations CRUD via Mongoose
 * 
 * Champs principaux :
 *  - title : titre de la tâche, obligatoire, longueur 1-255 caractères
 *  - description : description optionnelle de la tâche, max 1000 caractères
 *  - category_id : référence à un document Category, obligatoire
 *  - completed : booléen indiquant si la tâche est terminée, obligatoire, défaut false
 *  - created_at : date de création, obligatoire, valeur par défaut la date actuelle
 *  - updated_at : date de dernière modification, obligatoire, valeur par défaut la date actuelle
 *  - recovery_time : date de récupération ou échéance, optionnelle
 *  - point : score ou valeur associée à la tâche, optionnelle, entre 0 et 100
 * 
 * Fonctionnalités :
 *  - Les validations intégrées (required, minlength, maxlength, min, max) assurent la cohérence des données
 *  - La relation category_id permet d’associer chaque tâche à une catégorie
 *  - Le modèle `Task` peut être utilisé pour créer, lire, mettre à jour ou supprimer des tâches dans MongoDB
 * 
 * Usage typique :
 *  import Task from "../schemas/taskSchema.js";
 *  const newTask = await Task.create({ title: "Nettoyer la cuisine", category_id: someCategoryId });
 *  const tasks = await Task.find({ category_id: someCategoryId });
 * 
 * TODO / FIXME :
 *  - Ajouter un hook `pre-save` pour mettre à jour `updated_at` automatiquement lors des modifications
 *  - Ajouter des index sur `category_id` si recherche fréquente par catégorie
 */


import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  description: {
    type: String,
    maxlength: 1000,
    default: null
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // lien vers ta collection categories
    required: true
  },
  completed: {
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
  recovery_time: {
    type: Date,
    default: null
  },
  point: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;