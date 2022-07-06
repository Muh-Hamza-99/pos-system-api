const Product = require("../models/Product");

const AppError = require("../utilities/app-error");

const getAllProducts = async (req, res, next) => {
    const products = await Product.find({});
    res.status(200).json({ status: "success", results: products.length, data: { products }});
};

const getOneProduct = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    if (!product) return next(new AppError("No product with the provided ID!", 404));
    res.status(200).json({ status: "success", data: { product }});
};

const createProduct = async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({ status: "success", data: { product } });
};

const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!product) return next(new AppError("No product with the provided ID!", 404));
    res.status(200).json({ status: "success", data: { product } });
};

const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id); 
    if (!product) return next(new AppError("No product with the provided ID!", 404));
    res.status(204).json({ status: "success", data: null });
};

module.exports = {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};