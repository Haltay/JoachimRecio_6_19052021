const Sauce = require('../models/Sauce');       //  importation du model créé pour les sauces
const fs = require('fs');   //importation de fs pour avoir accès aux différentes opération liées au système de fichiers 


// creation d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    // delete sauceObject._id;        // supprimer l'id puisqu'il vient de mongoDB
    const sauce = new Sauce({
        ...sauceObject,               //  utilisation de l'operateur spread ...
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// modification d'une sauce existante
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
        .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`ìmages/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));

            });
        })
        .catch(error => res.status(500).json({ error }));
};

// trouver un objet par son identifiant
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// récuperation dans la base de données des sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// gestion du like dislike
exports.userLike = (req, res, next) => {
    const userId = req.body.userId;
    const sauceId = req.params.id;

    if (req.body.like === 1) {
        Sauce.updateOne({ _id: sauceId }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: userId } })
            .then(
                (sauce) => res.status(200).json({ message: 'Like ajouté' })
            )
            .catch(error => res.status(400).json({ error }))
    } else if (req.body.like === -1) {
        Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: userId } })
            .then(
                (sauce) => res.status(200).json({ message: 'Dislike ajouté' })
            )
            .catch(error => res.status(400).json({ error }))
    } else {
        Sauce.findOne({ _id: sauceId })
            .then(sauce => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                        .then(
                            (sauce) => res.status(200).json({ message: 'Vous détestez cette sauce' })
                        )
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                        .then(
                            (sauce) => res.status(200).json({ message: 'Vous aimez cette sauce' })
                        )
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
}