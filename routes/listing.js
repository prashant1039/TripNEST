const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const Booking = require("../models/booking");

const { isLoggedIn, isOwner } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schemas");
const listingcontroller = require("../controllers/listing");

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }

  next();
};

router.route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,
    upload.array("image", 5),
    validateListing,
    wrapAsync(listingcontroller.createListing)
  );

router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.renderEditForm)
);

router.route("/:id")
  .get(wrapAsync(listingcontroller.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.array("image", 5),
    validateListing,
    wrapAsync(listingcontroller.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingcontroller.deleteListing)
  );

// BOOKING PAGE
router.get("/:id/book",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    const basePrice = Number(listing.price) || 1000;

    const allRooms = [
      { number: 101, type: "Standard", price: basePrice },
      { number: 102, type: "Standard", price: basePrice },
      { number: 201, type: "Deluxe", price: basePrice + 800 },
      { number: 202, type: "Deluxe", price: basePrice + 800 },
      { number: 301, type: "Premium", price: basePrice + 1500 },
      { number: 302, type: "Premium", price: basePrice + 1500 },
      { number: 401, type: "Suite", price: basePrice + 2500 },
      { number: 402, type: "Suite", price: basePrice + 2500 },
    ];

    res.render("listings/book", {
      listing,
      allRooms
    });
  })
);

// BOOKING SAVE
router.post("/:id/book",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }

      const b = req.body.booking || {};

      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      const roomNumber = Number(b.roomNumber);

      if (!b.checkIn || !b.checkOut || checkOut <= checkIn) {
        req.flash("error", "❌ Check-out date must be after check-in date.");
        return res.redirect(`/listings/${listing._id}/book`);
      }

      if (!roomNumber) {
        req.flash("error", "❌ Please select a room.");
        return res.redirect(`/listings/${listing._id}/book`);
      }

      const alreadyBooked = await Booking.findOne({
        listing: listing._id,
        roomNumber,
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
      });

      if (alreadyBooked) {
        req.flash(
          "error",
          "❌ This room is already booked during these dates. Please choose another room or different dates."
        );
        return res.redirect(`/listings/${listing._id}/book`);
      }

      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const finalPrice = Number(b.finalPrice) || Number(listing.price) * nights;

      const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        name: b.name,
        phone: b.phone,
        checkIn,
        checkOut,
        guests: Number(b.guests),
        children: Number(b.children || 0),
        roomNumber,
        paymentMethod: b.paymentMethod,
        notes: b.notes || "",
        finalPrice,
      });

      await booking.save();

      req.flash("success", `🎉 Room ${roomNumber} booked successfully!`);
      res.redirect(`/listings/${listing._id}`);

    } catch (err) {
      req.flash("error", err.message);
      res.redirect(`/listings/${req.params.id}/book`);
    }
  })
);

module.exports = router;