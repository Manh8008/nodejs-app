require('dotenv').config();
const mongoose = require('mongoose');

async function connect() {
    try {
        const mongoUrl = process.env.MONGO_URL;

        console.log(mongoUrl);
        if (!mongoUrl) {
            throw new Error('MONGO_CONNECT_URL is not defined');
        }

        // Kết nối mà không cần các tùy chọn deprecated
        await mongoose
            .connect(mongoUrl)
            .then(() => {
                console.log('Database connected successfully');
            })
            .catch((err) => {
                console.error('Database connection error:', err);
            });
    } catch (err) {
        console.error('Connect failure:', err);
    }
}

module.exports = { connect };
