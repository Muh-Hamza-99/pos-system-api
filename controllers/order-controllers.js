const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/Order");
const Product = require("../models/Product");

const AppError = require("../utilities/app-error");
const APIFeatures = require("../utilities/api-features");
const catchAsync = require("../utilities/catch-async");
const isOwner = require("../utilities/is-owner");
const saveToGoogleSheets = require("../utilities/google-sheets");

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

const webhookCheckout = async (req, res, next) => {
    const signature = req.headers["stripe-signature"];
    let event;
    try { event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) { return res.status(400).send(`Webhook error: ${error.message}!`); };
    if (event.type === "checkout.session.completed") {
        await Order.findByIdAndUpdate(event.data.object.client_reference_id, { isPaid: true });
        await saveToGoogleSheets();
    };
};

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
    if (method === "add" && !productAlreadyInOrder) {
        order = await Order.findByIdAndUpdate(orderID, { $push: { "products": { product: productID, quantity } } }, { new: true, runValidators: true });
        await Product.findByIdAndUpdate(productID, { $inc: { quantity: -quantity } }, { new: true, runValidators: true });
    };
    if (method === "remove" && productAlreadyInOrder) {
        order = await Order.findByIdAndUpdate(orderID, { $pull: { "products": { product: productID } } }, { new: true, runValidators: true });
        await Product.findByIdAndUpdate(productID, { $inc: { quantity } }, { new: true, runValidators: true });
    };
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
    if (!isOwner(req.user.id, orderID, "Order")) return next(new AppError("You are not the owner of this order!", 403));
    const order = await Order.findByIdAndDelete(orderID);
    if (!order) return next(new AppError("No order with the provided ID!", 404));
    order.deleteOrder();
    res.status(204).json({ status: "success", data: null });
});

module.exports = {
    getAllOrders,
    getOneOrder,
    createOrder,
    updateOrderByProduct,
    updateOrderByQuantity,
    deleteOrder,
    getCheckoutSession,
    webhookCheckout,
};