const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json ({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
        if (!sauce) {
            res.status(404).json({ error: new Error('No such Thing!') });
        }
        if (sauce.userId !== req.decoded) {
            res.status(400).json({ error: new Error('Unauthorized request!') });
        } else {
            console.log(req.file);
            if (!req.file) {
                Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                .catch(error => res.status(400).json({ error }));                
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => { 
                    Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                    .catch(error => res.status(400).json({ error }));                         
                });
            }
    }})
    .catch(error => res.status(500).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: new Error('No such Thing!') });
            }
            if (sauce.userId !== req.decoded) {
                res.status(400).json({ error: new Error('Unauthorized request!') });
            } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
              });
            }})
            .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
        switch (req.body.like) {
            case 1 :        
        if(!sauce.usersLiked.includes(req.body.userId)){
            Sauces.updateOne(
                { _id: req.params.id },
                {
                    $inc: {likes: 1},
                    $push: {usersLiked: req.body.userId}
                }
            )
            .then(() => res.status(201).json({ message : "like"}))
            .catch(error => res.status(404).json({ error }));
        }
        break;

        case -1 :
        if(!sauce.usersDisliked.includes(req.body.userId)){
            Sauces.updateOne(
                { _id: req.params.id },
                {
                    $inc: {dislikes: 1},
                    $push: {usersDisliked: req.body.userId}
                }
            )
            .then(() => res.status(201).json({ message : "dislike"}))
            .catch(error => res.status(404).json({ error }));
        }
        break;

        case 0 :

        if(sauce.usersLiked.includes(req.body.userId)){
            Sauces.updateOne(
                { _id: req.params.id },
                {
                    $inc: {likes: -1},
                    $pull: {usersLiked: req.body.userId}
                }
            )
            .then(() => res.status(201).json({ message : "0"}))
            .catch(error => res.status(404).json({ error }));
        }
        
        if(sauce.usersDisliked.includes(req.body.userId)){
            Sauces.updateOne(
                { _id: req.params.id },
                {
                    $inc: {dislikes: -1},
                    $pull: {usersDisliked: req.body.userId}
                }
            )
            .then(() => res.status(201).json({ message : "0"}))
            .catch(error => res.status(404).json({ error }));
        }
        }
    })
    .catch(error => res.status(404).json({ error }));
};