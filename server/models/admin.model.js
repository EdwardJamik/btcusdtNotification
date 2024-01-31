const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        unique:true
    },
    password: {
        type: String,
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

adminSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("admin", adminSchema);