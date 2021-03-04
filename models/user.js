let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    mobileNo: { type: String, unique: true, trim: true },
    address: String,
    email: { type: String, unique: true, trim: true, lowercase: true },
    password: String
}, { timestamps: true });

let user = mongoose.model('user', Schema);
module.exports = user;