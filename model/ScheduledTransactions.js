const mongoose = require('mongoose');

const scheduledTransactionSchema = new mongoose.Schema({
    TransactionID: String,
    AccountID: Integer,
    ReceivingAccountID: Integer,
    Date: Date,
    TransactionAmount: Number,
    Comment: String
})

module.exports = mongoose.model('ScheduledTransactions', scheduledTransactionSchema);