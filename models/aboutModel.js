const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    occupation: {
        type: String,
    },
    company: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;
