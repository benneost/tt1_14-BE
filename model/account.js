const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    _id: String,
    accountid: String,
    password: String,
    email: String,
    role: String,
    token: String,
})

module.exports = mongoose.model('account', accountSchema);