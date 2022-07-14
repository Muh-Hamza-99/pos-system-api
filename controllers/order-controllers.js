const Order = require("../models/Order");

const AppError = require("../utilities/app-error");
const APIFeatures = require("../utilities/api-features");
const catchAsync = require("../utilities/catch-async");
const isOwner = require("../utilities/is-owner");

const getCheckoutSession = catchAsync(async (req, res, next) => {
    const { orderID } = req.params;
    const order = await Tour.findById(orderID);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: req.user.email,
        client_reference_id: orderID,
        line_items: [{
            name: "POS Order",
            description: order.summary,
            amount: order.totalPrice,
            currency: "usd",
        }],
    });
    res.status(200).json({ status: "success", data: { session } });
});

const getAllOrders = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Order.find({}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const orders = await features.query;
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

const updateOrderByProduct = catchAsync(async (req, res, next) => {
    const { method } = req.query;
    if (method !== "add" && method !== "remove") return next(new AppError("Missing/Invalid query parameter; it can only be 'add' or 'remove'!", 400));
    const { quantity } = req.body;
    const { productID, orderID } = req.params;
    let order = await Order.findById(orderID);
    if (!order) return next(new AppError("No order with the provided ID!", 404));
    if (!isOwner(req.user.id, orderID, "Order")) return next(new AppError("You are not the owner of this order!", 403));
    const productAlreadyInOrder = order.productAlreadyInOrder(productID);
    if (method === "add" && !productAlreadyInOrder) order = await Order.findByIdAndUpdate(orderID, { $push: { "products": { product: productID, quantity } } }, { new: true, runValidators: true });
    if (method === "remove" && productAlreadyInOrder) order = await Order.findByIdAndUpdate(orderID, { $pull: { "products": { product: productID } } }, { new: true, runValidators: true });
    res.status(200).json({ status: "success", data: { order } });
});

const updateOrderByQuantity = catchAsync(async (req, res, next) => {
    const { quantity } = req.body;
    const { productID, orderID } = req.params;
    let order = await Order.findById(orderID);
    if (!order) return next(new AppError("No order with the provided ID!", 404));
    if (!isOwner(req.user.id, orderID, "Order")) return next(new AppError("You are not the owner of this order!", 403));
    const productAlreadyInOrder = order.productAlreadyInOrder(productID);
    if (!productAlreadyInOrder) return next(new AppError("You can't update a product's quantity if it is not in the order!", 400));
    order = await Order.findByIdAndUpdate(orderID, { products: { $elemMatch: { product: productID, quantity } } });
    res.status(200).json({ status: "success", data: { order } });
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { orderID } = req.params;
    let order = await Order.findById(orderID);
    if (!isOwner(req.user.id, orderID, "Order")) return next(new AppError("You are not the owner of this order!", 403));
    if (!order) return next(new AppError("No order with the provided ID!", 404));
    res.status(204).json({ status: "success", data: null });
});

module.exports = {
    getAllOrders,
    getOneOrder,
    createOrder,
    updateOrderByProduct,
    updateOrderByQuantity,
    deleteOrder,
};