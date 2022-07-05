const User = require("../models/User");

const register = async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const user = await User.create({ name, email, password, passwordConfirm });
    res.status(201).json({ status: "success", data: { user } })
};