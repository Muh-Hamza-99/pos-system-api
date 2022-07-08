const express = require("express");
const router = express.Router();

const {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product-controllers");

const orderRouter = require("./order-routes");

router.use("/:productID/orders", orderRouter);

router
    .route("/")
    .get(getAllProducts)
    .post(createProduct);

router
    .route("/:id")
    .get(getOneProduct)
    .patch(updateProduct)
    .delete(deleteProduct);

module.exports = router;