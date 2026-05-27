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

  checkIn: {
    type: Date,
    required: true,
  },

  checkOut: {
    type: Date,
    required: true,
  },

  guests: {
    type: Number,
    required: true,
  },

  children: {
    type: Number,
    default: 0,
  },

  roomNumber: {
    type: Number,
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ["UPI", "Cash", "Card"],
    required: true,
  },

  notes: String,

  finalPrice: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);