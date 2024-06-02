const mongoose = require("mongoose");
const list_Schema = new mongoose.Schema({
    list_name: {
        type: String,
        required: true
    },
    list_user_id: {
        type: String,
        required: true
    }
});

const List = mongoose.model('List', list_Schema);
module.exports = List;
