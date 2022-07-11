const express = require("express");
const router = express.Router();

const {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product-controllers");

const protect = require("../middleware/protect");
const restrictTo = require("../middleware/restrict-to");

const orderRouter = require("./order-routes");

router.use("/:productID/orders", orderRouter);

router.get("/", getAllProducts);
router.get("/:id", getOneProduct);

router.use(protect, restrictTo("admin", "supplier"));

router.post("/", createProduct);

router
    .route("/:id")
    .patch(updateProduct)
    .delete(deleteProduct);

module.exports = router;