const express = require("express");
const router = express.Router();
const passport = require("passport");

const users = require("../controllers/user");
const { saveRedirectUrl } = require("../middleware");

// Signup
router.get("/signup", users.renderSignupForm);
router.post("/signup", saveRedirectUrl, users.signup);

// Login
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

// Logout
router.get("/logout", users.logout);

// OTP reset
router.get("/forgot", users.renderForgotForm);
router.post("/forgot", users.sendOtp);
router.post("/verify-otp", users.verifyOtp);

module.exports = router;