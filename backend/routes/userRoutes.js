/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Kullanıcı yönetimi
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm kullanıcıları getir (Admin için)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 64f8e1f2c8b4d123456789ab
 *                   name:
 *                     type: string
 *                     example: Ahmet Yılmaz
 *                   email:
 *                     type: string
 *                     example: ahmet@example.com
 *                   role:
 *                     type: string
 *                     example: admin
 *       500:
 *         description: Sunucu hatası
 */


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
