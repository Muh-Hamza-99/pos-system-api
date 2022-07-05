const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    isPaid: {
        type: Boolean,
        default: false,
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;