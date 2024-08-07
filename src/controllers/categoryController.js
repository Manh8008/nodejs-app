const Category = require('../models/Category');
const fs = require('fs')

class CategoryController {
    // [GET] /categories
    // [GET] /categories
    async getAll(req, res, next) {
        try {
            const categories = await Category.find({ parent: null })
                .populate({
                    path: 'subcategories',
                    populate: {
                        path: 'subcategories',
                        populate: {
                            path: 'subcategories',
                            // Tiếp tục populate nếu có nhiều cấp độ hơn
                        }
                    }
                });

            res.json(categories);
        } catch (err) {
            next(err);
        }
    }



    // [GET] /categories/parent/:parentSlug
    async getSubcategories(req, res, next) {
        try {
            const parentSlug = req.params.parentSlug;
            const parentCategory = await Category.findOne({ slug: parentSlug });

            if (!parentCategory) {
                return res.status(404).json({ message: 'Parent category not found' });
            }

            const subcategories = await Category.find({ parent: parentCategory._id });
            res.json(subcategories);
        } catch (err) {
            next(err);
        }
    }

    // [POST] /categories/create
    async create(req, res) {
        try {
            const image = req.file ? req.file.filename : undefined;
            const { name, description, parent } = req.body;
            if (!name || !description) {
                return res.status(400).json({ message: 'Thiếu thông tin cần thiết!' });
            }
            const obj = {
                name,
                description,
                image,
                parent: parent || null
            };

            await Category.create(obj);
            res.status(200).json({ message: 'Category added successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /categories/:id/edit
    async edit(req, res) {
        try {
            const category = await Category.findById(req.params.id).populate('subcategories');
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [PUT] /categories/:id
    async update(req, res) {
        try {
            const image = req.file ? req.file.filename : undefined;
            const { name, description, parent } = req.body;

            if (!name || !description) {
                return res.status(400).json({ message: 'Thiếu thông tin cần thiết!' });
            }
            const obj = {
                name,
                description,
                image,
                parent: parent || null
            };
            await Category.updateOne({ _id: req.params.id }, obj);
            res.status(200).json({ message: 'Category updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // [DELETE] /categories/:id
    async destroy(req, res) {
        try {
            await Category.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CategoryController();
