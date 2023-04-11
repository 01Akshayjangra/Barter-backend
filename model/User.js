const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true 
    },
    phone:{
        type: Number,
        required: true 
    },
    password:{
        type: String,
        required: true 
    },
    isAdmin: {
        type: Boolean,
        default:0,
        require: true
    },
    token: { type: String },
})

const User = mongoose.model('USER', userSchema);

module.exports = User;