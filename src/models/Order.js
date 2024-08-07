const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    cart: [
        {
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            description: { type: String, required: true },
            quantity: { type: Number, required: true },
            size: { type: String, required: true },
            slug: { type: String, required: true }
        }
    ],
    paymentMethod: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Canceled'],
        default: 'Pending'
    },
    totalAmount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
