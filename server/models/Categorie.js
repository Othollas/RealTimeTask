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