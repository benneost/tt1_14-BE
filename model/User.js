const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserID: String,
    Username: String,
    Password: String,
    Firstname: String,
    Lastname: String,
    Email: String,
    Address: String,
    OptIntoPhyStatements: String
})

module.exports = mongoose.model('user', userSchema);