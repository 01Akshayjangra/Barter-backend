const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: []
    },
    tools: {
        type: Array,
        default: []
    },
    category: {
        type: Array,
        default: []
    },
    avatar: { type: String },
    hearts: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Post = mongoose.model('POST', postSchema);
module.exports = Post;