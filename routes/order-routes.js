const express = require("express");
const router = express.Router();

const {
    getAllOrders,
    getOneOrder,
    createOrder,
    updateOrder,
    deleteOrder,
} = require("../controllers/order-controllers");

router
    .route("/")
    .get(getAllOrders)
    .post(createOrder);

router
    .route("/:id")
    .get(getOneOrder)
    .patch(updateOrder)
    .delete(deleteOrder);

module.exports = router;