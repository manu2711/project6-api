const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceController = require('../controllers/sauce')

router.post('/', auth, multer, sauceController.createSauce)
router.post('/:id/like', auth, sauceController.likes)
router.put('/:id', auth, multer, sauceController.updateSauce)
router.delete('/:id', auth, sauceController.deleteSauce)
router.get('/', auth, sauceController.getAllSauce)
router.get('/:id', auth, sauceController.getOneSauce)

module.exports = router
