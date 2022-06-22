const express = require('express')
const { getALLProducts, getALLProductsStatic } = require('../controllers/products')
const router = express.Router()


router.route('/').get(getALLProducts)
router.route('/static').get(getALLProductsStatic)


module.exports = router