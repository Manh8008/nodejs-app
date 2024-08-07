const paymentController = require('../controllers/paymentController')
const express = require('express')
const router = express.Router()

router.post('/createPayment', paymentController.createPayment)

module.exports = router
