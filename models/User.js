const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: String,
    mail: String,
    password: String
})

module.exports = User;