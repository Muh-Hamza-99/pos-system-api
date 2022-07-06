const express = require("express");
const router = express.Router();

const {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product-controllers");

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