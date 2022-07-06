const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") sendErrorDevelopment(err, res);
    else if (process.env.NODE_ENV === "production") sendErrorProduction(err, res); 
};

module.exports = globalErrorHandler;