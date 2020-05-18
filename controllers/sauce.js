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
exports.likes = async (req, res, next) => {
  // if like = 1, adding userId to usersliked and updatelikes
  if (req.body.like === 1) {
    const findSauce = () => {
      Sauce.findOne({ _id: req.params.id }, (err, sauce) => {
        if (err) throw err
        // console.log(sauce)
        return sauce
      })
    }
    try {
      const sauceFound = await findSauce()

      console.log(sauceFound)
      res.status(200).json({ message: 'ca marche !' })
    } catch (error) {
      res.status(400).json({ error })
    }
  }
  if (req.body.like === -1) {
    res.status(200).json({ message: 'Disliked' })
  }
  if (req.body.like === 0) {
    res.status(200).json({ message: 'No feedback' })
  }
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
