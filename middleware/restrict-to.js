const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return;
        next();
    };
};

module.exports = restrictTo;