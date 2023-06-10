const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // TTL (time-to-live) set to 300 seconds (5 minutes)
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
