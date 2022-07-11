const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    getAllOrders,
    getOneOrder,
    createOrder,
    updateOrder,
    deleteOrder,
} = require("../controllers/order-controllers");

const protect = require("../middleware/protect");
const restrictTo = require("../middleware/restrict-to");

router
    .route("/")
    .get(protect, restrictTo("admin"), getAllOrders)
    .post(createOrder);

router
    .route("/:orderID")
    .get(getOneOrder)
    .patch(updateOrder)
    .delete(deleteOrder);

module.exports = router;