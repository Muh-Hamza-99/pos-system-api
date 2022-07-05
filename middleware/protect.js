const { promisify } = require("util");

const JWT = require("jsonwebtoken");

const User = require("./../models/User");

const protect = catchAsync(async (req, res, next) => {
    let token;
    const { authorisation } = req.headers;
    if (authorisation && authorisation.startsWith("Bearer")) token = authorisation.split(" ")[1];
    if (!token) return;
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return;
    if (user.changedPasswordAfter(decoded.iat)) return;
    req.user = user;
    next();
});

module.exports = protect;