const { promisify } = require("util");

const JWT = require("jsonwebtoken");

const User = require("./../models/User");

const AppError = require("../utilities/app-error");
const catchAsync = require("../utilities/catch-async");

const protect = catchAsync(async (req, res, next) => {
    let token;
    const { authorisation } = req.headers;
    if (authorisation && authorisation.startsWith("Bearer")) token = authorisation.split(" ")[1];
    if (!token) return next(new AppError("You are not logged in! Please login to get access!", 401));
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("The user belonging to this user does no longer token!", 401));
    if (user.changedPasswordAfter(decoded.iat)) return next(new AppError("User has recently changed password! Please log in again!", 401));
    req.user = user;
    next();
});

module.exports = protect;