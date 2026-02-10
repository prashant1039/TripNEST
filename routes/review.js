const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");
const { isLoggedIn, isReviewOwner } = require("../middleware");
const reviews = require("../controllers/review");

// ================= VALIDATION =================
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// ================= CREATE REVIEW =================
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviews.createReview)
);

// ================= DELETE REVIEW =================
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
