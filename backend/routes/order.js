const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Sipariş oluşturma
router.post('/create', async (req, res) => {
  try {
    const { userId } = req.body;

    // Kullanıcının sepetinden ürünleri al
    const cartItems = await Cart.find({ userId });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Sepet boş" });
    }

    // Siparişi oluştur
    const order = new Order({
      userId,
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
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

// Belirli bir kullanıcının sipariş geçmişi
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // En yeni siparişler önce
    res.json(orders);
  } catch (error) {
    console.error("Sipariş geçmişi hatası:", error);
    res.status(500).json({ message: "Sipariş geçmişi getirilemedi" });
  }
});


router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Siparişler getirilemedi' });
  }
});

// GET /api/orders/:userId - Belirli kullanıcının tüm siparişlerini getirir


module.exports = router;
