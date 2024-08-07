const categoryController = require('../controllers/categoryController');
const express = require('express');
const upload = require('../middleware/upload');


const router = express.Router();

router.get('/', categoryController.getAll)
router.get('/parent/:parentSlug', categoryController.getSubcategories)
router.get('/:id/edit', categoryController.edit)
router.put('/:id', upload.single('image'), categoryController.update)
router.post('/create', upload.single('image'), categoryController.create)
router.delete('/:id', categoryController.destroy);


module.exports = router;
