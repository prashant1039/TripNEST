const express = require("express");
const router = express.Router();

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

// ================= INDEX + CREATE =================
router
  .route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,

    // 🔥 MULTIPLE IMAGES
    upload.array("image", 5),

    validateListing,
    wrapAsync(listingcontroller.createListing)
  );

// ================= NEW =================
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

// ================= SHOW =================
router.get("/:id", wrapAsync(listingcontroller.showListing));

// ================= EDIT =================
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.renderEditForm)
);

// ================= UPDATE + DELETE =================
router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,

    // 🔥 MULTIPLE IMAGES
    upload.array("image", 5),

    validateListing,
    wrapAsync(listingcontroller.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingcontroller.deleteListing)
  );

module.exports = router;