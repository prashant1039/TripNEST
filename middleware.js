const Listing = require("./models/listing");
const Review = require("./models/review");

// ================= LOGIN =================
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

// ================= SAVE REDIRECT =================
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

// ================= LISTING OWNER =================
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }


  if (!listing.owner) {
    req.flash("error", "This listing has no owner");
    return res.redirect(`/listings/${id}`);
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not edit this post");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// ================= REVIEW OWNER =================
module.exports.isReviewOwner = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  
  if (!review.author) {
    req.flash("error", "This review has no owner");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not delete this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
