const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

// Importations des différentes routes
const userRoutes = require('./routes/users')

mongoose
  .connect('mongodb+srv://accessUser:5K7F9UgwbVvxcd3W@cluster0-ruufw.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connection to database successful !'))
  .catch(() => console.log('Connection to database failed'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

app.use(bodyParser.json())

app.use('/api/auth', userRoutes)

module.exports = app
