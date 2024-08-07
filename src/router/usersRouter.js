const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')


router.post('/login', userController.login)
router.post('/register', userController.register)
router.delete('/:id', userController.deleteUser)
router.put('/:id', userController.updateUser)
router.get('/profile', userController.profile)
router.get('/', userController.getUsers)
router.post('/resetPassword', userController.resetPassword)
router.post('/changePassword', userController.changePassword)
router.post('/verifyCode/:userId', userController.verifyCode)


module.exports = router
