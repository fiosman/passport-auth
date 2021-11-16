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
module.exports = router;
