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
    required: true,
  },

  children: {
    type: Number,
    default: 0,
  },

  roomNumber: {
    type: Number,
    required: false,
    default: 1,
  },

  paymentMethod: {
    type: String,
    enum: ["UPI", "Cash", "Card"],
    required: true,
  },

  notes: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.index(
  {
    listing: 1,
    date: 1,
    roomNumber: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);