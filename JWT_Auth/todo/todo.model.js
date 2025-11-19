const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    desc: {type: String, required: true}
});

exports.todoModel = mongoose.model('todoModel', todoSchema, 'Todos');