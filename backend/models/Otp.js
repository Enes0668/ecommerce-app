const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, expires: 300, default: Date.now } // 5 dk sonra otomatik silinir
});

module.exports = mongoose.model('Otp', otpSchema);
