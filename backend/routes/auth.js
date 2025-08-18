/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         confirmPassword:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *     LoginUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     OTPRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *     OTPVerify:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *         otp:
 *           type: string
 *     ResetPassword:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *         - newPassword
 *       properties:
 *         email:
 *           type: string
 *         otp:
 *           type: string
 *         newPassword:
 *           type: string
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu.
 *       400:
 *         description: Hatalı istek veya email zaten kayıtlı.
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Giriş başarılı, token döner.
 *       400:
 *         description: Email veya şifre hatalı.
 */

/**
 * @swagger
 * /api/send-otp:
 *   post:
 *     summary: OTP gönder
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTPRequest'
 *     responses:
 *       200:
 *         description: OTP gönderildi.
 *       400:
 *         description: Email girilmedi.
 */

/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: OTP doğrula
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTPVerify'
 *     responses:
 *       200:
 *         description: OTP doğru.
 *       400:
 *         description: Kod hatalı veya süresi dolmuş.
 */

/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Şifre sıfırlama
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Şifre başarıyla güncellendi.
 *       400:
 *         description: Kod geçersiz veya kullanıcı bulunamadı.
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const OtpModel = require('../models/Otp'); // OTP için model, eğer varsa
const { body, validationResult } = require('express-validator');

const { validate } = require('../middleware/validate');
const { loginSchema, registerSchema } = require('../validators/auth.schema');
const { loginIpLimiter, loginAccountLimiter } = require('../middleware/rateLimiters');

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
router.post(
  "/register", validate(registerSchema),
  [
    // 🔐 VALIDATION KURALLARI
    body("username")
      .notEmpty().withMessage("Kullanıcı adı boş bırakılamaz.")
      .isLength({ min: 3 }).withMessage("Kullanıcı adı en az 3 karakter olmalı."),

    body("email")
      .notEmpty().withMessage("Email gerekli.")
      .isEmail().withMessage("Geçerli bir e-posta giriniz."),

    body("password")
      .notEmpty().withMessage("Şifre boş bırakılamaz.")
      .isLength({ min: 8 }).withMessage("Şifre en az 8 karakter olmalı.")
      .matches(/[A-Z]/).withMessage("Şifre en az bir büyük harf içermeli.")
      .matches(/[a-z]/).withMessage("Şifre en az bir küçük harf içermeli.")
      .matches(/\d/).withMessage("Şifre en az bir rakam içermeli.")
      .matches(/[\W_]/).withMessage("Şifre en az bir özel karakter içermeli."),

    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Şifreler uyuşmuyor.");
        }
        return true;
      }),

    body("phone")
      .optional()
      .isMobilePhone().withMessage("Geçerli bir telefon numarası giriniz."),

    body("address")
      .optional()
      .isLength({ min: 5 }).withMessage("Adres en az 5 karakter olmalı.")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // ❌ Validasyon hatalarını gönder
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password, address, phone } = req.body;

      // 📛 Aynı e-posta daha önce kayıtlı mı?
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Bu email zaten kayıtlı." });
      }

      // 🔐 Şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 🧑 Yeni kullanıcı oluştur
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        address,
        phone,
      });

      await newUser.save();
      res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu." });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Sunucu hatası." });
    }
  }
);

module.exports = router;

// Giriş yapma
router.post(
  "/login",loginIpLimiter,
  validate(require('../validators/auth.schema').loginSchema),
  loginAccountLimiter,
  [
    // Validasyon kuralları
    body("email")
      .notEmpty().withMessage("Email alanı boş bırakılamaz.")
      .isEmail().withMessage("Geçerli bir e-posta adresi giriniz."),
    body("password")
      .notEmpty().withMessage("Şifre boş bırakılamaz.")
  ],
  async (req, res) => {
    // Validasyon hataları varsa döndür
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email veya şifre yanlış." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Email veya şifre yanlış." });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Giriş başarılı.",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Sunucu hatası." });
    }
  }
);

module.exports = router;
