const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const decrypt = require("../utilities/decrypt");

const userSchema = new mongoose.Schema({
    username: {
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

userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", function(next) {
    if (this.username === process.env.ADMIN_USERNAME && this.email === process.env.ADMIN_EMAIL && this.password === process.env.ADMIN_PASSWORD) this.role = "admin";
    next();
});

userSchema.pre("save", function(next) {
    if (this.username.startsWith("SUPPLIER-")) this.role = "supplier";
    next();
});

userSchema.methods.correctPassword = async function(providedPassword, userPassword) {
    return await bcrypt.compare(providedPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    };
    return false;
};

userSchema.methods.isSupplierWhitelisted = async function() {
    const suppliers = await decrypt();
    for (let supplier in suppliers) if (supplier.username === this.username && supplier.email === this.email && supplier.password === this.password) return true;
    return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;