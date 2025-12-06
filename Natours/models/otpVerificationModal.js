const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  userData: { type: Object, required: true },
  verificationToken: String, // Store signup data temporarily
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto-delete after 10 minutes
});

const OTPVerification = mongoose.model('OTPVerification', otpSchema);
module.exports = OTPVerification;
