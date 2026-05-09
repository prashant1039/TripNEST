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


// ================= VALIDATION =================
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }

  next();
};


// ================= LISTINGS =================
router.route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,
    upload.array("image", 5),
    validateListing,
    wrapAsync(listingcontroller.createListing)
  );

router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

router.get("/:id", wrapAsync(listingcontroller.showListing));

router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.renderEditForm)
);

router.route("/:id")
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


// ======================================================
// 🟢 BOOKING PAGE
// ======================================================
router.get("/:id/book",
  isLoggedIn,
  wrapAsync(async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/book", { listing });
  })
);


// ======================================================
// 🟢 BOOKING SAVE (WORKING 100%)
// ======================================================
router.post("/:id/book",
  isLoggedIn,
  wrapAsync(async (req, res) => {

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
      paymentMethod: b.paymentMethod,
      message: b.notes || ""
    });

    await booking.save();

    req.flash("success", "Booking successful!");
    res.redirect(`/listings/${listing._id}`);
  })
);

module.exports = router;