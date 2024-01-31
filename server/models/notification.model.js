const mongoose = require("mongoose");

const notificationScheme = new mongoose.Schema({
    price:{
        type: Number,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    type:{
        type: String,
        required: true,
        enum: ['bid', 'ask']
    },
    updatedAt: {
        type: Date,
        default: function() {
            return new Date();
        },
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
},{ timestamps: true })

module.exports = mongoose.model('notification', notificationScheme)