const Booking = require("../models/booking");
const Listing = require("../models/listing");

// SHOW BOOKING PAGE
module.exports.renderBookingForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("bookings/new", { listing });
};

// CREATE BOOKING
module.exports.createBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = new Booking({
      ...req.body.booking,
      listing: id,
      user: req.user._id,
    });

    await booking.save();

    req.flash("success", "Luxury room booked successfully!");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    req.flash("error", "This room is already booked for selected date.");
    res.redirect(`/listings/${req.params.id}/book`);
  }
};