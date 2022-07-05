const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Please tell us your name!"],
    },
    email: {
        type: String,
        required: [true, "Please tell us your email!"],
        unique: true,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ["user", "supplier", "admin"],
        default: "user", 
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password!"],
        validate: {
            validator: function(value) {
                return value === this.password;
            },
            message: "Passwords do not match!",
        },
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;