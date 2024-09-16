const mongoose = require('mongoose');
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    price: Number,
    image: String,
    quantity: Number,
    description: String,
    categorySlug: String,
    isProductNew: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    slug: { type: String, slug: ['name'] }

}, { timestamps: true });

// Custom query helpers

ProductSchema.query.sortStable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidType ? req.query.type : 'desc',
        })
    }
    return this;
}

module.exports = mongoose.model('Product', ProductSchema);
