const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Tüm ürünleri getir
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// ID'ye göre ürün getir
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Yeni ürün modeli (daha önce oluşturduysan)
    const newProduct = new Product({
      name,
      price,
      description,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Ürün eklenirken hata oluştu' });
  }
});


module.exports = router;
