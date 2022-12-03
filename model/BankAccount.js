const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    AccountID: String,
    UserID: Number,
    AccountType: String,
    AcccountBalance: String,
})

module.exports = mongoose.model('BankAccount', BankAccountSchema);