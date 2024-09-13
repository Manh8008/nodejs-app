require('dotenv').config();

const mongoose = require('mongoose');

async function connect() {
    try {
        const mongoUrl = process.env.MONGO_CONNECT_URL;

        console.log(mongoUrl);
        if (!mongoUrl) {
            throw new Error('MONGO_CONNECT_URL is not defined');
        }
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect successfully !');
    } catch (err) {
        console.error('Connect failure:', err);
    }
}

module.exports = { connect };
