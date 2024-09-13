require('dotenv').config();
const mongoose = require('mongoose');

async function connect() {
    try {
        const mongoUrl = process.env.MONGO_CONNECT_URL;

        console.log(mongoUrl);
        if (!mongoUrl) {
            throw new Error('MONGO_CONNECT_URL is not defined');
        }

        // Kết nối mà không cần các tùy chọn deprecated
        await mongoose.connect(mongoUrl);
        console.log('Connect successfully!');
    } catch (err) {
        console.error('Connect failure:', err);
    }
}

module.exports = { connect };
