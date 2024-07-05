const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    name: String,
    profession: String, 
    url: String,
    tag: {
        type: String,
        enum: ['web', 'app', 'iot', 'ml', 'cy', 'cloud', 'ds']
    }
});

const Resume = new mongoose.model('Resume', resumeSchema);
module.exports = Resume;