const Sauce = require('../models/sauce')
const fs = require('fs')

// Create a sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0
  })
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce correctly added !' }))
    .catch(error => res.status(400).json({ error }))
}

// Gestion des Likes et Dislikes
exports.likes = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // if like = 1, adding userId to usersLiked and update likes
      if (req.body.like === 1) {
        sauce.usersLiked.push(req.body.userId)
        Sauce.updateOne(
          { _id: req.params.id },
          { likes: sauce.usersLiked.length, usersLiked: sauce.usersLiked }
        )
          .then()
          .catch(error => res.status(500).json({ error }))

        // if like = -1, adding userId to usersDisliked and update dislikes
      } else if (req.body.like === -1) {
        sauce.usersDisliked.push(req.body.userId)
        Sauce.updateOne(
          { _id: req.params.id },
          {
            dislikes: sauce.usersDisliked.length,
            usersDisliked: sauce.usersDisliked
          }
        )
          .then()
          .catch(error => res.status(500).json({ error }))

        // if like = 0, removing userId from usersLike and usersDisliked and update dislikes
      } else if (req.body.like === 0) {
        if (sauce.usersLiked.includes(req.body.userId)) {
          const indexUserId = sauce.usersLiked.indexOf(req.body.userId)

          sauce.usersLiked.splice(indexUserId, 1)
          Sauce.updateOne(
            { _id: req.params.id },
            {
              usersLiked: sauce.usersLiked,
              likes: sauce.usersLiked.length
            }
          )
            .then()
            .catch(error => res.status(500).json({ error }))
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          const indexUserId = sauce.usersDisliked.indexOf(req.body.userId)
          sauce.usersDisliked.splice(indexUserId, 1)
          Sauce.updateOne(
            { _id: req.params.id },
            {
              usersDisliked: sauce.usersDisliked,
              dislikes: sauce.usersDisliked.length
            }
          )
            .then()
            .catch()
        }
      }
      res.status(200).json({ message: 'Thanks for your feedback ' })
    })
    .catch(error => res.status(500).json({ error }))
}

// Update a sauce
exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`
    }
    : { ...req.body }
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: 'Sauce modified successfully' })
    )
    .catch(error => res.status(400).json({ error }))
}

// Delete a sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        thing
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Deleted' }))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

// Get all sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => {
      res.status(200).json(sauces)
    })
    .catch(error => res.status(400).json({ error: error }))
}

// Get One sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}
