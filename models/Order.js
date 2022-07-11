const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
                max: 10000,
                validate: {
                    validator: function(value) {
                        return Number.isInteger(value)
                    },
                    message: "The number provided for initial stock is not a whole number!",
                },
            },
        },
    ],
    isPaid: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

orderSchema.methods.productAlreadyInOrder = function(productID) {
    return this.products.some(obj => obj.product.toString() === productID);
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;