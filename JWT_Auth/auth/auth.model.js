const mongoose = require("mongoose");


mongoose.connect("").then(() => {
    console.log("DB connected");
}).catch((e) => {
    console.log(`Db not connected ${e.message}`);
})

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

exports.userModel = mongoose.model('userModel', userSchema, 'Users');












