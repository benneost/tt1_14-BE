const mongoose = require('mongoose');

const scheduledTransactionSchema = new mongoose.Schema({
    TransactionID: String,
    AccountID: String,
    ReceivingAccountID: String,
    Date: Date,
    TransactionAmount: Double,
    Comment: String
})

module.exports = mongoose.model('shelduletransaction', shelduleTransactionSchema);