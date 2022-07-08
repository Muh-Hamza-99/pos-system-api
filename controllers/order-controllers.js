const Order = require("../models/Order");

const AppError = require("../utilities/app-error");
const catchAsync = require("../utilities/catch-async");

const getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({});
    res.status(200).json({ status: "success", results: orders.length, data: { orders }});
});

const getOneOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id)
    if (!order) return next(new AppError("No order with the provided ID!", 404));
    res.status(200).json({ status: "success", data: { order }});
});

const createOrder = catchAsync(async (req, res, next) => {
    const order = await Order.create(req.body);
    res.status(201).json({ status: "success", data: { order } });
});

const updateOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!order) return next(new AppError("No order with the provided ID!", 404));
    res.status(200).json({ status: "success", data: { order } });
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id); 
    if (!order) return next(new AppError("No order with the provided ID!", 404));
    res.status(204).json({ status: "success", data: null });
});

module.exports = {
    getAllOrders,
    getOneOrder,
    createOrder,
    updateOrder,
    deleteOrder,
};