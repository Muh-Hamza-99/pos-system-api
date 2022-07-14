const Product = require("../models/Product");

const AppError = require("../utilities/app-error");
const APIFeatures = require("../utilities/api-features");
const catchAsync = require("../utilities/catch-async");

const getAllProducts = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Product.find({}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const products = await features.query;
    res.status(200).json({ status: "success", results: products.length, data: { products }});
});

const getOneProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    if (!product) return next(new AppError("No product with the provided ID!", 404));
    res.status(200).json({ status: "success", data: { product }});
});

const createProduct = catchAsync(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({ status: "success", data: { product } });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!product) return next(new AppError("No product with the provided ID!", 404));
    res.status(200).json({ status: "success", data: { product } });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id); 
    if (!product) return next(new AppError("No product with the provided ID!", 404));
    res.status(204).json({ status: "success", data: null });
});

module.exports = {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};