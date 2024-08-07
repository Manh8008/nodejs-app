const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderController {
    // Lấy tất cả các đơn hàng
    async getAll(req, res, next) {
        try {
            const orders = await Order.find()
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }
    async recentOrders(req, res, next) {
        try {
            const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }


    // Lấy một đơn hàng theo ID
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const { username, phone, address, totalAmount, cart, paymentMethod } = req.body;

            console.log("Received totalAmount:", totalAmount); // Thêm dòng này để kiểm tra

            // Kiểm tra dữ liệu đầu vào
            if (!username || !phone || !address || !cart || !paymentMethod || totalAmount == null) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Kiểm tra các sản phẩm trong giỏ hàng
            const cartItems = await Promise.all(cart.map(async (item) => {
                const product = await Product.findById(item._id);
                if (!product) {
                    throw new Error(`Product with ID ${item._id} not found`);
                }
                if (product.quantity < item.quantity) {
                    throw new Error(`Not enough stock for product with ID ${item._id}`);
                }
                return {
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    description: product.description,
                    quantity: item.quantity,
                    size: item.size,
                    slug: product.slug,
                };
            }));

            // Tạo đơn hàng mới
            const newOrder = new Order({
                username,
                phone,
                address,
                cart: cartItems,
                paymentMethod,
                totalAmount
            });

            // Lưu đơn hàng
            await newOrder.save();

            res.status(200).json(newOrder);
        } catch (error) {
            next(error);
        }
    }


    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['Pending', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Canceled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.json(updatedOrder);
        } catch (error) {
            next(error);
        }
    }

    async calculateTotalRevenue(req, res, next) {
        try {
            const result = await Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" }
                    }
                }
            ]);

            if (result.length > 0) {
                res.json({ totalRevenue: result[0].totalRevenue });
            } else {
                res.json({ totalRevenue: 0 });
            }
        } catch (error) {
            next(error);
        }
    }

    // Đếm số lượng đơn hàng
    async countOrders(req, res, next) {
        try {
            const orderCount = await Order.countDocuments();
            res.json({ orderCount });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();
