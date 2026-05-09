const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  guests: {
    type: Number,
    required: true,   // ✅ THIS FIXES YOUR ERROR
  },

  children: {
    type: Number,
    default: 0,
  },

  paymentMethod: {
    type: String,
    enum: ["UPI", "Cash"],
    required: true,
  },

  message: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);