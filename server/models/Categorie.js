/**
 * Schéma Mongoose pour les catégories
 * 
 * Rôle :
 *  - Définir la structure et les contraintes d'une catégorie dans la base de données MongoDB
 *  - Garantir l'unicité du nom et la présence des timestamps
 * 
 * Champs :
 *  - name        : String, obligatoire, unique, nom de la catégorie
 *  - description : String, optionnel, description de la catégorie
 *  - created_at  : Date, obligatoire, date de création
 *  - updated_at  : Date, obligatoire, date de dernière mise à jour
 * 
 * Usage typique :
 *  const Categorie = require('./categorieSchema');
 *  const newCat = new Categorie({ name: 'Cuisine', created_at: new Date(), updated_at: new Date() });
 *  await newCat.save();
 */

import mongoose from 'mongoose';
// creation de la categorie
        const mongoose = require('mongoose');
        const categorieSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
                unique: true
            },
            description: {
                type: String,
                required: false,
                unique: false
            },
            created_at: {
                type: Date,
                required: true,
                unique: false
            },
            updated_at: {
                type: Date,
                required: true,
                unique: false
            }
        });

module.exports = mongoose.model('Categorie', categorieSchema)