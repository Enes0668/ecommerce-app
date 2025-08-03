require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const User = require('./models/User');
const cartRoutes = require('./routes/cart');
const path = require('path');
const { ObjectId } = require('mongodb');
const protectedRoute = require('./routes/protectedRoute');
const orderRoutes = require('./routes/order');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const app = express();
const OtpModel = require('./models/Otp');
const productRoutes = require('./routes/productRoutes');
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/api/orders', orderRoutes);
app.use('/api', authRoutes);
 app.use('/protected', protectedRoute);
 app.use('/api/users', userRoutes);
// --- MONGO DB BAĞLANTISI ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı başarılı.'))
.catch((err) => console.error('MongoDB bağlantısı başarısız:', err));


// --- ROUTER ---
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

async function saveOtpToDB(email, otp) {
  // Aynı email için eski OTP'leri sil (opsiyonel)
  await OtpModel.deleteMany({ email });

  const newOtp = new OtpModel({ email, otp });
  await newOtp.save();
}

// --- ÜRÜNLER ROUTE ---
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    // Eğer category parametresi geldiyse, filtreye ekle
    if (category) {
      filter.category = category;
    }

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


// --- CART ROUTE ---
app.post('/api/cart/add', async (req, res) => {
    try {
        const { userId, productId, name, price, quantity } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ message: 'Eksik bilgi' });
        }

        const mongoose = require('mongoose');
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
            return res.status(200).json({ message: 'Ürün sepete eklendi' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası, sepete eklenemedi' });
    }
});



// --- AUTH ROUTE ---
const bcrypt = require("bcrypt");

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



const jwt = require('jsonwebtoken');

app.post("/api/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı" });

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Şifre yanlış" });

    // JWT oluştur
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
const sendEmail = require('./utils/email');

// Örnek Express.js backend endpoint
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log(`OTP for ${email}: ${otp}`); // Konsola yaz

  try {
    await saveOtpToDB(email, otp); // Veritabanına kaydet
    await sendEmail(email, 'Doğrulama Kodu', `Doğrulama kodunuz: ${otp}`);
    res.json({ message: 'OTP gönderildi.' });
  } catch (err) {
    console.error('Mail gönderilemedi:', err); // Hata logu
    res.status(500).json({ message: 'Mail gönderilemedi.' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  console.log('Email from router.query:', email);
  if(!otp){
    return res.status(400).json({message: 'OTP eksik'})
  }
  else if (!email) {
  }

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

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Kullanıcıyı email'e göre bul
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // OTP eşleşmesini kontrol et
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'OTP geçersiz' });
    }

    // Yeni şifreyi hash'le
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle
    user.password = hashedPassword;

    // OTP'yi temizle (bir kere kullanılabilir)
    user.otp = undefined;

    await user.save();

    res.status(200).json({ message: 'Şifre başarıyla güncellendi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// --- SUNUCUYU BAŞLAT ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));


// --- ERROR HANDLING ---
process.on('uncaughtException', (err) => {
    console.error('Beklenmedik Hata:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise Reddi:', reason);
});

