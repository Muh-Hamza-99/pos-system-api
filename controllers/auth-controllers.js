const JWT = require("jsonwebtoken");

const User = require("../models/User");

const signToken = id => JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRES_IN });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
    };
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({ status: "success", token });
};

const register = async (req, res, next) => {
    const { username, email, password, passwordConfirm } = req.body;
    const user = await User.create({ username, email, password, passwordConfirm });
    createSendToken(user, 201, res);
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !await user.correctPassword(password, user.password)) return;
    createSendToken(user, 200, res);
};

module.exports = {
    register, 
    login,
};