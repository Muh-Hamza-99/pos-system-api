const express = require("express");
const app = express();

const expressRateLimit = require("express-rate-limit");
const expressMongoSanitise = require("express-mongo-sanitize");
const XSS = require("xss-clean");
const helmet = require("helmet");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const CORS = require("cors");

const { webhookCheckout } = require("./controllers/order-controllers");

const userRouter = require("./routes/user-routes");
const productRouter = require("./routes/product-routes");
const orderRouter = require("./routes/order-routes");

const AppError = require("./utilities/app-error");
const globalErrorHandler = require("./middleware/error-handler");

const limiter = expressRateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this device! Please try again after an hour!",
});

app.options("*", CORS());

app.use(compression());

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

app.use(expressMongoSanitise());
app.use(XSS());
app.use(helmet());

app.use("/api", limiter);

/* No frontend has been created, so apologies in advance if the webhookCheckout controller has any 
errors, as I haven't tested it! */
app.post("/webhook-checkout", bodyParser.raw({ type: "application/json" }), webhookCheckout);

app.all("*", (req, res, next) => {
    res.status(404).json({ status: "fail", message: `Can't find ${req.originalUrl} on this server!` });
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;