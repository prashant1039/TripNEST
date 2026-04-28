const User = require("../models/user");
const nodemailer = require("nodemailer");
require("dotenv").config();

// 📧 EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= SIGNUP =================
module.exports.renderSignupForm = (req, res) => {
  res.render("user/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body.user;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    // 💌 SEND WELCOME EMAIL
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: "🎉 Welcome to TripNest!",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#4CAF50;">Hey ${username} 👋</h2>
          <p>Welcome to <b>TripNest</b> 🌍✨</p>

          <p>
            We're super happy to have you with us 💖<br>
            Your journey starts here!
          </p>

          <p>
            ✈️ Explore new places<br>
            🏡 Find amazing stays<br>
            ❤️ Make memories
          </p>

          <hr>

          <p style="color:gray;">
            Thank you for choosing us 💫<br>
            <b>— Team TripNest</b>
          </p>
        </div>
      `,
    });

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to TripNest!");
      res.redirect(res.locals.redirectUrl || "/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// ================= LOGIN =================
module.exports.renderLoginForm = (req, res) => {
  res.render("user/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

// ================= LOGOUT =================
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out!");
    res.redirect("/listings");
  });
};

// ================= OTP RESET =================

// 👉 Forgot page
module.exports.renderForgotForm = (req, res) => {
  res.render("user/forgot");
};

// 👉 Send OTP (ANY email)
module.exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ email });

    if (user) {
      user.otp = otp;
      user.otpExpires = Date.now() + 300000;
      await user.save();
    }

    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: "OTP for Password Reset",
      text: `Your OTP is: ${otp}`,
    });

    req.flash("success", "OTP sent");
    res.render("user/verify", { email });

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/forgot");
  }
};

// 👉 Verify OTP
module.exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Invalid OTP");
      return res.redirect("/forgot");
    }

    user.setPassword(password, async (err) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/forgot");
      }

      user.otp = undefined;
      user.otpExpires = undefined;

      await user.save();

      req.flash("success", "Password reset successful!");
      res.redirect("/login");
    });

  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/forgot");
  }
};