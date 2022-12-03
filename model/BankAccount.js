const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    AccountID: String,
    UserID: String,
    AccountType: String,
    AcccountBalance: String,
})

module.exports = mongoose.model('bankaccount', BankAccountSchema);