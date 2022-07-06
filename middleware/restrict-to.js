const AppError = require("../utilities/app-error");


const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(new AppError("You don't have permission to perform this task!", 403));
        next();
    };
};

module.exports = restrictTo;