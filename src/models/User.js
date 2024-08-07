const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    verificationCode: String,
    isConfirmed: { type: Boolean, default: false }
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
