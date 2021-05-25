const mongoose = require('mongoose');

// Ajout du plugin mongoose unique validator pour être sûr qu'une seule adresse email corresponde à un seul compte
const uniqueValidator = require('mongoose-unique-validator');

//Creation du schema de l'utilisateur
const userSchema = mongoose.Schema({
            // Ajouter pour avoir l'identifiant unique de MongoDB
    email: { type: String, required: true, unique: true },
    password: { type:String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);