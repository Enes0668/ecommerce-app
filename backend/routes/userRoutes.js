// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Tüm kullanıcıları getir (Admin için)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password -otpCode -otpExpires'); // Şifre ve hassas alanlar hariç
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcılar alınamadı' });
  }
});

module.exports = router;
