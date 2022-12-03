const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    AccountID: String,
    UserID: String,
    AccountType: String,
    AcccountBalance: String,
})

module.exports = mongoose.model('user', userSchema);