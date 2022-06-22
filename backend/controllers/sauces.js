const Sauce = require('../models/ModelsSauce');
const fs = require('fs')

exports.postNewSauces = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    sauce.save()
    .then(() => {res.status(201).json({message: 'Sauce saved successfully'})})
    .catch((error) => {res.status(400).json({error: error})})
};

exports.putModifySauces = (req, res, next) => {
    const sauceObject = req.file ?
        { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(sauce => {
            res.status(200).json({ message: 'Object modified' })
            }
        )
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log(sauce.userId)
            console.log(req.body)
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce deleted' }))
                        .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
}

exports.postLikeSauces = async (req, res, next) => {
    const sauce = await Sauce.findOne({ _id: req.params.id })

        let likeNumber = parseInt(req.body.like)

        if (req.body.like === 1) {
            sauce.likes  += 1
            sauce.usersLiked.push(req.body.userId);
        }

        if (req.body.like === 0) {

            const indexLiked = sauce.usersLiked.findIndex(userId => userId === req.body.userId)
            if (indexLiked !== -1) {
                sauce.likes -= 1
                sauce.usersLiked.splice(indexLiked, 1);
            }

            const indexDisliked = sauce.usersDisliked.findIndex(userId => userId === req.body.userId)
            if (indexDisliked !== -1) {
                sauce.dislikes -= 1
                sauce.usersDisliked.splice(indexDisliked, 1)
            }
        }

        if (req.body.like === -1) {
            sauce.dislikes += 1
            sauce.usersDisliked.push(req.body.userId)
        }
    
   sauce.save().then(() => res.json(200)).catch(err => console.log(err))
}

exports.getSingleSauces = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            })
        }
    )
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};