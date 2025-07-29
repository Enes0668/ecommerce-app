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

router.post('/api/products', async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Eğer categoryName id ise, önce kategoriyi bul
    const category = await Category.findById(category);
    if (!category) {
      return res.status(400).json({ message: 'Kategori bulunamadı' });
    }

    const product = new Product({
      name,
      price,
      description,
      category: category._id,  // Burada kategori adını kaydediyoruz
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ürün oluşturulurken hata oluştu' });
  }
});


module.exports = router;
