const mongoose = require("mongoose");

const telegramUsersSchema = new mongoose.Schema({
    chat_id: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
    },
    first_name: {
        type: String,
    },
    access: {
        type: Boolean,
        default:false
    },
    access_time: {
        type: Date,
    },
    ban: {
        type: Boolean,
        default:false
    },
    bot_started: {
        type: Boolean,
        default:false
    },
    test_access: {
        type: Boolean,
        default:false
    },
    notification_access_end: {
        type: Boolean,
        default:false
    },
    user_bot_ban: {
        type: Boolean,
        default:false
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

module.exports = mongoose.model('telegramUsers', telegramUsersSchema)
