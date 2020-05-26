const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const validation = require('../middleware/validation')

// Création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Validation des entrées utilisateur
  const { error } = validation.register(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user
        .save()
        .then(() => res.status(201).json({ message: 'New user created !' }))
        .catch(error => res.status(400).json({ message: error.message }))
    })
    .catch(error => res.status(500).json({ error }))
}

// Connection d'un utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'User not found' })
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Wrong password' })
          }
          res.status(200).json({
            userId: user.id,
            token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
              expiresIn: '24h'
            })
          })
        })
        .catch()
    })
    .catch(error => res.status(500).json({ error }))
}
