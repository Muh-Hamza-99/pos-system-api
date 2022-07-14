const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell the product name!"],
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Please tell the product description!"],
        maxlength: 256,
    },
    price: {
        type: Number,
        required: [true, "Please tell us the product price!"],
        min: 0.99,
        max: 9999.99,
    },
    quantityInStock: {
        type: Number,
        required: [true, "Please tell us the initial stock of the product!"],
        validate: {
            validator: function(value) {
                return Number.isInteger(value)
            },
            message: "The number provided for initial stock is not a whole number!",
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;