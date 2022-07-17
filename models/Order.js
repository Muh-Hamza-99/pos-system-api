const mongoose = require("mongoose");

const Product = require("../models/Product");

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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

orderSchema.virtual("totalPrice").get(function() {
    return this.products.reduce((firstProduct, secondProduct) => { return (firstProduct.product.price * firstProduct.quantity) + (secondProduct.product.price * secondProduct.quantity) }, 0)
});

orderSchema.methods.productAlreadyInOrder = function(productID) {
    return this.products.some(obj => obj.product.toString() === productID);
};

orderSchema.methods.deleteOrder = function() {
    this.products.forEach(async obj => {
        await Product.findByIdAndUpdate(obj.product, { $inc: { quantityInStock: obj.quantity } });
    });
};

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;