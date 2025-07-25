const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const OtpModel = require('../models/Otp'); // OTP için model, eğer varsa

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// OTP gönderme endpointi
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email girilmedi" });

  const otp = generateOTP();

  try {
    // Eğer OTP modelin varsa, eski OTP'leri sil (isteğe bağlı)
    await OtpModel.deleteMany({ email });

    // Yeni OTP kaydet
    const newOtp = new OtpModel({ email, otp, createdAt: new Date() });
    await newOtp.save();

    // Mail gönder
    await sendEmail(email, 'Doğrulama Kodu', `Doğrulama kodunuz: ${otp}`);

    res.json({ message: 'OTP gönderildi.' });
  } catch (err) {
    console.error('Mail gönderilemedi:', err);
    res.status(500).json({ message: 'Mail gönderilemedi.' });
  }
});

// OTP doğrulama
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await OtpModel.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Kod hatalı veya süresi dolmuş.' });

    // Doğruysa OTP kaydını sil
    await OtpModel.deleteOne({ _id: record._id });

    res.json({ message: 'OTP doğru.' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Şifre sıfırlama
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı." });

    const otpRecord = await OtpModel.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: "Kod geçersiz veya süresi dolmuş." });

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // OTP kaydını sil
    await OtpModel.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "Şifre başarıyla güncellendi." });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

// Kayıt olma
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, address, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Bu email zaten kayıtlı." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, address, phone });
    await newUser.save();

    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Giriş yapma
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email veya şifre yanlış." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email veya şifre yanlış." });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
