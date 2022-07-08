require("dotenv").config({ path: "./config.env" });

const mongoose = require("mongoose");

const express = require("express");
const app = express();

const userRouter = require("./routes/user-routes");
const productRouter = require("./routes/product-routes");
const orderRouter = require("./routes/order-routes");

const AppError = require("./utilities/app-error");
const globalErrorHandler = require("./middleware/error-handler");

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

app.all("*", (req, res, next) => {
    res.status(404).json({ status: "fail", message: `Can't find ${req.originalUrl} on this server!` });
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const DB = process.env.MONGO_URI.replace("<PASSWORD>", process.env.MONGO_PASSWORD);

mongoose.connect(DB)
    .then(() => console.log("Successfully connected to database!"))
    .catch(error => console.log(`Oh no, something went wrong...${error}`));

const PORT = process.env.PORT || 8000

app.listen(PORT, console.log(`Server is up and running on port ${PORT}...`));