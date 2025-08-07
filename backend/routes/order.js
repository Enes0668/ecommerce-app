const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Sipariş oluşturma
router.post('/create', async (req, res) => {
  try {
    const { userId } = req.body;
    let totalPrice = 0;

    // Kullanıcının sepetini al
    const cartItems = await Cart.find({ userId });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Sepet boş" });
    }

    const orderItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Ürün bulunamadı: ${item.productId}` });
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    // Siparişi oluştur
    const order = new Order({
      userId,
      items: orderItems,
      totalPrice
    });

    await order.save();

    // Sepeti temizle
    await Cart.deleteMany({ userId });

    res.status(201).json({ message: "Sipariş oluşturuldu", order });
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);
    res.status(500).json({ message: "Sipariş oluşturulamadı" });
  }
});

// Kullanıcının sipariş geçmişi (en yeni önce)
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Sipariş geçmişi hatası:", error);
    res.status(500).json({ message: "Sipariş geçmişi getirilemedi" });
  }
});

// Belirli kullanıcıya ait siparişleri ürünlerle birlikte getir
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('items.productId');
    res.json(orders);
  } catch (err) {
    console.error("Kullanıcı siparişleri alınamadı:", err);
    res.status(500).json({ message: 'Siparişler alınamadı.' });
  }
});

// Tüm siparişleri getir (admin için)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('items.productId')
      .populate('userId', 'username email');
    res.json(orders);
  } catch (err) {
    console.error('Sipariş alma hatası:', err);
    res.status(500).json({ message: 'Siparişler alınamadı' });
  }
});

module.exports = router;
