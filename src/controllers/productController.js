const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

class ProductController {
    // [GET] /products
    async getAll(req, res) {
        try {
            const products = await Product.find({}).sortStable(req);
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /products/:slug
    async getOne(req, res) {
        try {
            const product = await Product.findOne({ slug: req.params.slug });
            if (product) {
                product.views += 1;
                await product.save();
                res.json(product);
            } else {
                res.status(404).json({ message: 'Sản phẩm không tìm thấy!' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /products/category/:categorySlug
    async getProductsByCategory(req, res) {
        try {
            const categorySlug = req.params.categorySlug || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const skip = (page - 1) * limit;

            const totalCount = await Product.countDocuments({ categorySlug });
            const products = await Product.find({ categorySlug }).skip(skip).limit(limit).sortStable(req);
            const totalPages = Math.ceil(totalCount / limit);

            res.json({ products, totalPages });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [POST] /products/create
    async create(req, res) {
        try {
            const image = req.file ? req.file.filename : undefined;
            const { name, price, description, quantity, categorySlug } = req.body;

            if (!name || !price || !description || !quantity || !categorySlug) {
                return res.status(400).json({ message: 'Thiếu thông tin cần thiết!' });
            }
            const obj = {
                name,
                price,
                description,
                quantity,
                categorySlug,
                image,
            };

            await Product.create(obj);
            res.status(200).json({ message: 'Thêm sản phẩm thành công!' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /products/:id/edit
    async edit(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [PUT] /products/:id

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, price, description, quantity, categorySlug } = req.body;
            const oldProduct = await Product.findById(id);

            if (!oldProduct) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
            }

            if (!name || !price || !description || !quantity || !categorySlug) {
                return res.status(400).json({ message: 'Thiếu thông tin cần thiết!' });
            }

            if (req.file) {
                image = req.file.filename;
                const oldImagePath = path.join(__dirname, '../../public/images', oldProduct.image);

                fs.unlink(oldImagePath, (err) => {
                    if (err && err.code == 'ENOENT') {
                        console.info('File không tồn tại sẽ không xóa nó!');
                    } else if (err) {
                        console.error('Đã xảy ra lỗi khi cố gắng xóa tệp!', err);
                    } else {
                        console.info('Đã xóa hình ảnh cũ!');
                    }
                });
            }

            const data = {
                name,
                price,
                description,
                quantity,
                categorySlug,
                image,
            };

            await Product.updateOne({ _id: id }, data);
            res.status(200).json({ message: 'Cập nhật sản phẩm thành công!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [DELETE] /products/:id
    async destroy(req, res) {
        try {
            await Product.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /products/search/:keyword
    async search(req, res) {
        try {
            const keyword = req.params.keyword || '';
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const skip = (page - 1) * limit;
            const regex = new RegExp(keyword, 'i');

            const totalCount = await Product.countDocuments({ name: regex });
            const products = await Product.find({ name: regex }).skip(skip).limit(limit).sortStable(req);

            const totalPages = Math.ceil(totalCount / limit);

            res.json({ products: Array.isArray(products) ? products : [], totalPages });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /products/new
    async newProducts(req, res) {
        try {
            const products = await Product.find().sort({ createdAt: -1 }).limit(5);

            const transformedProducts = products.map((product) => ({
                ...product.toObject(),
                condition: 'showNew',
            }));
            res.json(transformedProducts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /products/outstanding
    async outstandingProducts(req, res) {
        try {
            const products = await Product.find().sort({ views: -1 }).limit(5);

            const transformedProducts = products.map((product) => ({
                ...product.toObject(),
                condition: 'showHot',
            }));

            res.json(transformedProducts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();
