const AppError = require("../utilities/app-error");

const sendErrorDevelopment = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        error,
        message: error.message,
        stack: error.stack,
    });
};

const sendErrorProduction = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({ 
            status: error.status, 
            message: error.message, 
        });
    } else {
        console.log(`Oh no, something went wrong! ${error}`);
        res.status(500).json({ status: "error", message: "Something went very wrong!" });
    };
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") sendErrorDevelopment(err, res);
    else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === "ValidationError") error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
        sendErrorProduction(err, res);
    };
    next();
};

module.exports = globalErrorHandler;