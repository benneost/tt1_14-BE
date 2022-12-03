const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserID: Number,
    Username: String,
    Password: String,
    Firstname: String,
    Lastname: String,
    Email: String,
    Address: String,
    OptIntoPhyStatements: Number
})

module.exports = mongoose.model('Users', userSchema);