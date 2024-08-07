const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: true },
    image: String,
    description: String,
    slug: { type: String, unique: true },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true });

// Tạo slug từ tên
CategorySchema.pre('save', async function (next) {
    if (this.isModified('name') || this.isNew) {
        let slug = slugify(this.name, { lower: true, strict: true });
        if (this.parent) {
            const parentCategory = await this.model('Category').findById(this.parent);
            if (parentCategory) {
                slug = `${slugify(parentCategory.name, { lower: true, strict: true })}-${slug}`;
            }
        }

        // Kiểm tra tính duy nhất của slug
        const existingCategory = await this.model('Category').findOne({ slug });
        if (existingCategory) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`; // Thêm một chuỗi ngẫu nhiên
        }
        this.slug = slug;
    }
    next();
});


// Định nghĩa subcategories
CategorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent'
});

CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Category', CategorySchema);
