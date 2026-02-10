const express = require("express");
const router = express.Router();
const passport = require("passport");

const users = require("../controllers/user"); // ✅ path must match
const { saveRedirectUrl } = require("../middleware");

// SIGNUP
router.get("/signup", users.renderSignupForm);
router.post("/signup", saveRedirectUrl, users.signup);

// LOGIN
router.get("/login", users.renderLoginForm);
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  users.login
);

// LOGOUT
router.get("/logout", users.logout);

module.exports = router;
