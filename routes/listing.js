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

    const allRooms = [
      101, 102, 103, 104, 105,
      201, 202, 203, 204, 205,
      301, 302, 303, 304, 305
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

      const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        name: b.name,
        phone: b.phone,
        date: b.date,
        guests: Number(b.guests),
        children: Number(b.children || 0),
        roomNumber: Number(b.roomNumber),
        paymentMethod: b.paymentMethod,
        notes: b.notes || ""
      });

      await booking.save();

      req.flash("success", `🎉 Room ${b.roomNumber} booked successfully!`);
      res.redirect(`/listings/${listing._id}`);

    } catch (err) {
      if (err.code === 11000) {
        req.flash(
          "error",
          "❌ This room is already booked for the selected date. Please choose another room."
        );
      } else {
        req.flash("error", err.message);
      }

      res.redirect(`/listings/${req.params.id}/book`);
    }
  })
);

module.exports = router;