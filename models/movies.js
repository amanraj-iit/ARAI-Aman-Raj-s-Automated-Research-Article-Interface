const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    "Research Paper Name": {
        type: String,
        required: true 
    },
    "CITE Score": {
        type: String,
        required: true
    },
    "The Research Paper image": {
        type: String,
        required: true
    },
    "Research Paper description": {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Research Paper', MovieSchema)
