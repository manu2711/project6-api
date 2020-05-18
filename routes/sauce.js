const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceController = require('../controllers/sauce')

router.post('/', multer, sauceController.createSauce)
router.post('/:id/like', sauceController.likes)
router.put('/:id', multer, sauceController.updateSauce)
router.delete('/:id', sauceController.deleteSauce)
router.get('/', sauceController.getAllSauce)
router.get('/:id', sauceController.getOneSauce)

module.exports = router
