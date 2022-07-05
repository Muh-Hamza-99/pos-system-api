const User = require("../models/User");

const register = async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const user = await User.create({ name, email, password, passwordConfirm });
    res.status(201).json({ status: "success", data: { user } })
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !await user.correctPassword(password, user.password)) return;
    res.status(200).json({ status: "success", data: { user } });
};

module.exports = {
    register, 
    login,
};