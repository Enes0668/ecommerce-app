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
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// --- MONGO DB BAĞLANTISI ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı başarılı.'))
.catch((err) => console.error('MongoDB bağlantısı başarısız:', err));


// --- ROUTER ---
app.use('/api/cart', cartRoutes);


// --- ÜRÜNLER ROUTE ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
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
        const userObjectId = mongoose.Types.ObjectId(userId);
        const productObjectId = mongoose.Types.ObjectId(productId);

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
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Kayıt başarısız." });
    }
});



app.post("/api/auth/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı" });

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Şifre yanlış" });

        res.status(200).json({ userId: user._id, username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Sunucu hatası, giriş başarısız." });
    }
});


app.get('/api/cart/add/user/:userId', async (req, res) => {
    try {
        const cartItems = await Cart.find({ userId: req.params.userId });
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json(err);
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
