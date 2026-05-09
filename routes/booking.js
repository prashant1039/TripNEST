const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");


// ================= MY BOOKINGS DASHBOARD =================
router.get("/",
  isLoggedIn,
  wrapAsync(async (req, res) => {

    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.render("bookings/index", { bookings });
  })
);


// ================= CANCEL BOOKING (OPTIONAL BUT USEFUL) =================
router.delete("/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/bookings");
    }

    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "Not authorized");
      return res.redirect("/bookings");
    }

    await Booking.findByIdAndDelete(req.params.id);

    req.flash("success", "Booking cancelled");
    res.redirect("/bookings");
  })
);

module.exports = router;