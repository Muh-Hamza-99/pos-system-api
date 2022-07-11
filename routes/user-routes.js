const express = require("express");
const router = express.Router();

const {
    register, 
    login,
} = require("../controllers/auth-controllers");

const {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
} = require("../controllers/user-controllers");

router.post("/register", register);
router.post("/login", login);

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