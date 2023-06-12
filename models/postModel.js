const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
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
    hearts: { type: Array, default: 0 },
    views: { type: Number, default: 0 },
    shares: { type: Array, default: 0 },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},
    { timestamps: true }
)

const Post = mongoose.model('Post', postSchema);
module.exports = Post;