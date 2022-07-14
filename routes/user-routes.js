const express = require("express");
const router = express.Router();

const {
    register, 
    login,
    logout,
    forgotPassword,
    resetPassword,
} = require("../controllers/auth-controllers");

const {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
} = require("../controllers/user-controllers");

const protect = require("../middleware/protect");
const restrictTo = require("../middleware/restrict-to");
const getMe = require("../middleware/get-me");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);

router.get("/me", getMe, getOneUser);

router.use(restrictTo("admin"));

router
    .route("/")
    .get(getAllUsers)
    .post(createUser);

router
    .route("/:id")
    .get(getOneUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;