const mongoose = require("mongoose");
const task_Schema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true
    },
    task_list_id: {
        type: String,
        required: true
    },
    task_user_id: {
        type: String,
        required: true
    },
    is_Checked: {
        type: Boolean,
        required: true
    }
});

const Task = mongoose.model('Task', task_Schema);
module.exports = Task;
