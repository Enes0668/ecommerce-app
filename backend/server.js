require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const setupSwagger = require("./swagger.js");

const { securityMiddlewares } = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimiters');


const app = express();
securityMiddlewares(app);
app.use(express.json());
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const User = require('./models/User');
const OtpModel = require('./models/Otp');

const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const protectedRoute = require('./routes/protectedRoute');
const orderRoutes = require('./routes/order');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');

const sendEmail = require('./utils/email');


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://ecommerce-app-rho-plum.vercel.app',
  credentials: true
}));
app.use('/api', apiLimiter);
// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı başarılı.'))
.catch((err) => console.error('MongoDB bağlantısı başarısız:', err));

// Routerlar (eğer /routes klasöründe detaylı route tanımların varsa bu satırlar yeterli)
app.use('/api/orders', orderRoutes);
app.use('/api', authRoutes);
app.use('/protected', protectedRoute);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
setupSwagger(app);

async function saveOtpToDB(email, otp) {
  // Aynı email için eski OTP'leri sil (opsiyonel)
  await OtpModel.deleteMany({ email });

  const newOtp = new OtpModel({ email, otp });
  await newOtp.save();
}

// Ekstra routes — Bunlar opsiyonel, kendi route dosyalarında olabilirler.
// Eğer bunları route dosyalarına koyduysan, burada tutmana gerek yok.
// Ancak direkt burada tanımladıysan böyle devam edebilirsin.

// Ürünler GET + POST
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) filter.category = category;

    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Ürünler getirilemedi' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Ürün ekleme hatası:', err);
    res.status(400).json({ message: 'Ürün eklenemedi', error: err.message });
  }
});

// Sepete ürün ekleme
app.post('/api/cart/add', async (req, res) => {
  try {
    const { userId, productId, name, price, quantity } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: 'Eksik bilgi' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    let cartItem = await Cart.findOne({ userId: userObjectId, productId: productObjectId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.status(200).json({ message: 'Ürün miktarı güncellendi' });
    } else {
      const newCartItem = new Cart({
        userId: userObjectId,
        productId: productObjectId,
        name,
        price,
        quantity,
      });
      await newCartItem.save();
      return res.status(201).json({ message: 'Ürün sepete eklendi.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası, sepete eklenemedi' });
  }
});

// Kullanıcı kaydı (register)
app.post("/api/auth/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      address: req.body.address,
      phone: req.body.phone
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kayıt başarısız." });
  }
});

// Kullanıcı girişi (login)
app.post("/api/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı" });

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Şifre yanlış" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      username: user.username,
      userId: user._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası, giriş başarısız." });
  }
});

// Kullanıcının sepetini getir
app.get('/api/cart/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartItems = await Cart.find({ userId: userId });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Sepet çekme hatası:', error);
    res.status(500).json({ message: 'Sepet alınamadı.' });
  }
});

// Sepetten ürün silme
app.delete('/api/cart/:id', async (req, res) => {
  try {
    const cartItemId = req.params.id;
    await Cart.findByIdAndDelete(cartItemId);
    res.status(200).json({ message: 'Ürün sepetten silindi' });
  } catch (error) {
    console.error('Silme hatası:', error);
    res.status(500).json({ message: 'Ürün silinemedi.' });
  }
});

// OTP gönderme
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log(`OTP for ${email}: ${otp}`);

  try {
    await saveOtpToDB(email, otp);
    await sendEmail(email, 'Doğrulama Kodu', `Doğrulama kodunuz: ${otp}`);
    res.json({ message: 'OTP gönderildi.' });
  } catch (err) {
    console.error('Mail gönderilemedi:', err);
    res.status(500).json({ message: 'Mail gönderilemedi.' });
  }
});

// OTP doğrulama
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!otp) return res.status(400).json({ message: 'OTP eksik' });
  if (!email) return res.status(400).json({ message: 'Email eksik' });

  const emailTrimmed = email.trim().toLowerCase();
  const otpTrimmed = otp.trim();

  console.log('Gönderilen email:', emailTrimmed);
  console.log('Gönderilen otp:', otpTrimmed);

  const record = await OtpModel.findOne({ email: emailTrimmed, otp: otpTrimmed });

  if (!record) {
    console.log('OTP doğrulama başarısız');
    return res.status(400).json({ message: 'Kod yanlış veya süresi dolmuş.' });
  }

  console.log('OTP doğrulama başarılı');
  res.json({ message: 'Doğrulama başarılı.' });
});

// Şifre sıfırlama
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Burada user.otp kontrolü yapmak için öncelikle User modelinde otp alanı olması gerekiyor.
    // Eğer otp'yi OtpModel'de saklıyorsan, burayı ona göre düzenlemelisin.

    const otpRecord = await OtpModel.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP geçersiz veya süresi dolmuş' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    // OTP kullanıldıktan sonra sil
    await OtpModel.deleteMany({ email });

    res.status(200).json({ message: 'Şifre başarıyla değiştirildi' });
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Statik dosya servisi (frontend uygulaması varsa)
app.use(express.static(path.join(__dirname, 'public')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Sayfa bulunamadı' });
});

if (require.main === module){
// Server başlatma
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor...`);
})
}

module.exports = app;