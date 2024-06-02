const mongoose = require("mongoose");
const user_Schema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    user_password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', user_Schema);
module.exports = User;
