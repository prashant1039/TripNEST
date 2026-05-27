const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const Listing = require("../models/listing");

const { isLoggedIn } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

// BOOKING FORM
router.get(
  "/listings/:id/book",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("bookings/new", { listing });
  })
);

// CREATE BOOKING
router.post(
  "/listings/:id/book",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    try {
      const bookingData = req.body.booking;

      const booking = new Booking({
        listing: req.params.id,
        user: req.user._id,
        name: bookingData.name,
        phone: bookingData.phone,
        date: bookingData.date,
        guests: bookingData.guests,
        children: bookingData.children || 0,
        roomNumber: Number(bookingData.roomNumber),
        paymentMethod: bookingData.paymentMethod,
        notes: bookingData.notes,
      });

      await booking.save();

      req.flash(
        "success",
        `🎉 Room ${bookingData.roomNumber} booked successfully!`
      );

      res.redirect(`/listings/${req.params.id}`);

    } catch (err) {
      if (err.code === 11000) {
        req.flash(
          "error",
          `❌ Room ${req.body.booking.roomNumber} is already booked. Please choose another room.`
        );
      } else {
        req.flash("error", "Something went wrong while booking.");
      }

      res.redirect(`/listings/${req.params.id}/book`);
    }
  })
);

// MY BOOKINGS
router.get(
  "/bookings",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.render("bookings/index", { bookings });
  })
);

// CANCEL BOOKING
router.delete(
  "/bookings/:id",
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

    req.flash("success", "Booking cancelled successfully!");
    res.redirect("/bookings");
  })
);

module.exports = router;