const productController = require('../controllers/productController');
const express = require('express');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', productController.getAll);
router.get('/:slug', productController.getOne);
router.post('/create', upload.single('image'), productController.create);
router.get('/:id/edit', productController.edit);
router.put('/:id', upload.single('image'), productController.update);
router.delete('/:id', productController.destroy);
router.get('/search/:keyword', productController.search);
router.get('/filter/new', productController.newProducts);
router.get('/filter/outstanding', productController.outstandingProducts);
router.get('/category/:categorySlug', productController.getProductsByCategory);

module.exports = router;
