const mongoose = require("mongoose");
const validator = require('validator');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value);
        },
        message: "Email is invalid or already in use!"
    },
    password: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isMD5(value);
        }
    },
    role: {
        type: String,
        default: "normal",
        validate: (value) => {
            const arr = ["normal", "admin", "super_admin"];
            return arr.includes(value);
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", UserSchema);