/**
 * Category Schema (Mongoose)
 * 
 * Rôle global :
 *  - Définir la structure et les contraintes d'une catégorie dans la base MongoDB
 *  - Fournir un modèle utilisable pour les opérations CRUD via Mongoose
 * 
 * Champs principaux :
 *  - name : nom de la catégorie, obligatoire, longueur 1-255 caractères
 *  - description : texte optionnel, longueur max 1000 caractères, valeur par défaut `null`
 *  - owner : référence à un document User, valeur par défaut `null`
 *  - created_at : date de création, valeur par défaut la date actuelle
 *  - updated_at : date de dernière modification, valeur par défaut la date actuelle
 * 
 * Fonctionnalités :
 *  - Les validations intégrées (required, maxlength, minlength) assurent la cohérence des données
 *  - Le champ owner permet d'associer une catégorie à un utilisateur spécifique
 *  - Le modèle `Category` peut être utilisé pour créer, lire, mettre à jour ou supprimer des catégories dans MongoDB
 * 
 * Usage typique :
 *  import Category from "../schemas/categorieSchema.js";
 *  const newCat = await Category.create({ name: "Cuisine" });
 *  const cats = await Category.find();
 * 
 * TODO / FIXME :
 *  - Ajouter des index si nécessaire pour les recherches fréquentes sur `name` ou `owner`
 *  - Ajouter un hook `pre-save` pour mettre à jour `updated_at` automatiquement
 */


import mongoose from "mongoose";

const categorieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  description: {
    type: String,
    default: null,
    maxlength: 1000
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // si tu as une collection User
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model("Category", categorieSchema, "categories"); 
export default Category;
