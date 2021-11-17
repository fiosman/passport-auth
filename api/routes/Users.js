const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  logoutUser,
  getUserProfile,
  changeUserPassword,
} = require("../controllers/userController");
const passport = require("passport");
const {
  resetPasswordRequestController,
  resetPasswordController,
} = require("../controllers/UserController");
require("../../services/Passport")(passport);

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", passport.authenticate("jwt", { session: false }), getUserProfile);
router.post(
  "/change_password",
  passport.authenticate("jwt", { session: false }),
  changeUserPassword
);
router.get("/reset_password", resetPasswordRequestController);
router.get("/confirm_reset_password", resetPasswordController);
module.exports = router;
