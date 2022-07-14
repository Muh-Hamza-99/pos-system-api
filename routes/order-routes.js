const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    getCheckoutSession,
    getAllOrders,
    getOneOrder,
    createOrder,
    updateOrderByProduct,
    updateOrderByQuantity,
    deleteOrder,
} = require("../controllers/order-controllers");

const protect = require("../middleware/protect");
const restrictTo = require("../middleware/restrict-to");

router.get("/checkout-session/:orderID", protect, getCheckoutSession);

router
    .route("/")
    .get(protect, restrictTo("admin"), getAllOrders)
    .post(createOrder);

router
    .route("/:orderID")
    .get(getOneOrder)
    .delete(deleteOrder);

router.patch("/:orderID/product", updateOrderByProduct);
router.patch("/:orderID/quantity", updateOrderByQuantity);

module.exports = router;