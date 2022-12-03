const mongoose = require('mongoose');

const scheduledTransactionSchema = new mongoose.Schema({
    TransactionID: Number,
    AccountID: Number,
    ReceivingAccountID: Number,
    Date: Date,
    TransactionAmount: Number,
    Comment: String
})

module.exports = mongoose.model('ScheduledTransactions', scheduledTransactionSchema);