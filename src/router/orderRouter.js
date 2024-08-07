const orderController = require('../controllers/orderController')
const express = require('express')

const router = express.Router()

router.get('/', orderController.getAll)
router.get('/recentOrders', orderController.recentOrders)
router.get('/:id', orderController.getOne)
router.get('/statistical/totalAmount', orderController.calculateTotalRevenue)
router.get('/statistical/countOrders', orderController.countOrders)
router.post('/create', orderController.create)
router.put('/:id', orderController.updateStatus)



module.exports = router
