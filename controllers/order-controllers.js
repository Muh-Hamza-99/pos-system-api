const Order = require("../models/Order");

const AppError = require("../utilities/app-error");
const catchAsync = require("../utilities/catch-async");

const getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({});
    res.status(200).json({ status: "success", results: orders.length, data: { orders }});
});

const getOneOrder = catchAsync(async (req, res, next) => {
    const { orderID } = req.params;
    const order = await Order.findById(orderID).populate("products");
    if (!order) return next(new AppError("No order with the provided ID!", 404));
    res.status(200).json({ status: "success", data: { order }});
});

const createOrder = catchAsync(async (req, res, next) => {
    const { id: userID } = req.user;
    const order = await Order.create({ user: userID });
    res.status(201).json({ status: "success", data: { order } });
});

const updateOrder = catchAsync(async (req, res, next) => {
    const { method } = req.query;
    if (method !== "add" && method !== "remove") return next(new AppError("Missing/Invalid query parameter; it can only be 'add' or 'remove'!", 400));
    const { quantity } = req.body;
    const { productID, orderID } = req.params;
    let order = await Order.findById(orderID);
    if (!order) return next(new AppError("No order with the provided ID!", 404));
    const productAlreadyInOrder = order.productAlreadyInOrder(productID);
    if (method === "add" && !productAlreadyInOrder) order = await Order.findByIdAndUpdate(orderID, { $push: { "products": { product: productID, quantity } } }, { new: true, runValidators: true });
    if (method === "remove" && productAlreadyInOrder) order = await Order.findByIdAndUpdate(orderID, { $pull: { "products": { product: productID } } }, { new: true, runValidators: true });
    res.status(200).json({ status: "success", data: { order } });
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { orderID } = req.params;
    const order = await Order.findByIdAndDelete(orderID); 
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