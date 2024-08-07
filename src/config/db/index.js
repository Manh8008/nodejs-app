const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/fe_2_dev');
        console.log("Connect successfully !");
    } catch (err) {
        console.log("Connect failue !");
    }
}

module.exports = { connect }

