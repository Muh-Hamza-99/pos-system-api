const User = require("../models/User");

const AppError = require("../utilities/app-error");
const catchAsync = require("../utilities/catch-async");

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({ status: "success", results: users.length, data: { users }});
});

const getOneUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new AppError("No user with the provided ID!", 404));
    res.status(200).json({ status: "success", data: { user }});
});

const createUser = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({ status: "success", data: { user } });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!user) return next(new AppError("No user with the provided ID!", 404));
    res.status(200).json({ status: "success", data: { user } });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { active: false }, { new: true, runValidators: true }); 
    if (!user) return next(new AppError("No user with the provided ID!", 404));
    res.status(204).json({ status: "success", data: null });
});

module.exports = {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
};