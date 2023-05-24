const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Token will expire in 1 hour
  },
});

const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema);

module.exports = EmailVerification;
