const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// creation d'une sauce
router.post('/', auth, multer, saucesCtrl.createSauce);

// modification d'une sauce existante
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// Suppression d'une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// trouver un objet par son identifiant
router.get('/:id', auth, saucesCtrl.getOneSauce);

// récuperation dans la base de données des sauces
router.get('/', auth, saucesCtrl.getAllSauces);

// gestion du like (1) ou non (0) de la sauce
router.post('/:id/like', auth, saucesCtrl.userLike);

module.exports = router;