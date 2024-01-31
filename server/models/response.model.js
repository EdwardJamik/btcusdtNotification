const mongoose = require("mongoose");

const responseScheme = new mongoose.Schema({
    response:{
        type: String,
        required: true,
    },
    id_response:{
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Response', responseScheme)