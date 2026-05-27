if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");

// ROUTES
const listingsRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");
const bookingRouter = require("./routes/booking");

// VIEW ENGINE
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// DATABASE
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });

// SESSION
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

app.use(
  session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  res.locals.q = req.query.q || "";
  next();
});

// ROUTES
app.use("/listings", listingsRouter);
app.use("/listings", reviewsRouter);
app.use("/", userRouter);
app.use("/", bookingRouter);

// 404 HANDLER
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);

  // Duplicate room booking error
  if (err.code === 11000) {
    req.flash(
      "error",
      "❌ This room is already booked for the selected date. Please choose another room."
    );

    return res.redirect(req.get("Referrer") || "/listings");
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).render("listings/error", {
    message,
  });
});

// SERVER
app.listen(8080, () => {
  console.log("Server running on port 8080");
});