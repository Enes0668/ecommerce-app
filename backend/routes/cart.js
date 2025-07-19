const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Sepete ürün ekleme route
router.post('/add', async (req, res) => {
    try {
        const { userId, productId, name, price, quantity } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'Eksik bilgi' });
        }

        const newCartItem = new Cart({
            userId,
            productId,
            name,
            price,
            quantity,
        });

        await newCartItem.save();

        res.status(200).json({ message: 'Ürün sepete eklendi' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası, sepete eklenemedi' });
    }
});

module.exports = router;
