/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Kullanıcı sepeti işlemleri
 */

/**
 * @swagger
 * /api/cart/user/{userId}:
 *   get:
 *     summary: Kullanıcının sepetini getir
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Kullanıcının ID'si
 *     responses:
 *       200:
 *         description: Sepet başarıyla getirildi
 *       500:
 *         description: Sepet getirilemedi
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Sepete ürün ekle
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ürün sepete eklendi
 *       200:
 *         description: Ürün zaten varsa miktar arttırıldı
 *       500:
 *         description: Sepete ekleme başarısız
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Sepetteki ürünün miktarını güncelle
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ürün miktarı güncellendi
 *       400:
 *         description: Ürün bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /api/cart/clear/{userId}:
 *   delete:
 *     summary: Kullanıcının sepetini temizle
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sepet başarıyla temizlendi
 *       500:
 *         description: Sepet temizlenemedi
 */


const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Kullanıcının sepetini getirme
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartItems = await Cart.find({ userId })
      .populate({
        path: 'productId',
        populate: {
          path: 'category',
          model: 'Category'
        }
      });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Sepet getirilemedi:', error);
    res.status(500).json({ message: "Sepet getirilemedi" });
  }
});

// Sepete ürün ekleme (POST '/api/cart')
router.post('/', async (req, res) => {
  try {
    const { userId, productId, name, price, categoryName } = req.body;

    let existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      return res.status(200).json(existingItem);
    } else {
      const newCartItem = new Cart({
        userId,
        productId,
        name,
        price,
        quantity: 1,
        categoryName
      });
      await newCartItem.save();
      return res.status(201).json(newCartItem);
    }
  } catch (error) {
    console.error('Sepete ekleme hatası:', error);
    res.status(500).json({ message: 'Sepete ekleme başarısız' });
  }
});

// Adet güncelleme
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) return res.status(400).json({ message: 'Ürün bulunamadı' });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Ürün miktarı güncellendi' });
  } catch (error) {
    console.error('Adet güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Sepeti temizleme
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Eğer userId string ise direkt kullan
    const result = await Cart.deleteMany({ userId });

    res.status(200).json({ message: 'Sepet başarıyla temizlendi', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Sepet temizleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası, sepet temizlenemedi', error: error.message });
  }
});

module.exports = router;
