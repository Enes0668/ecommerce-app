const express = require('express');
const mongoose = require('mongoose'); // mongoose'yi import et
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const categoryId = req.query.category;
    let filter = {};

    if (categoryId) {
      filter.category = categoryId;  // Sadece seçili kategoriyi filtrele
    }

    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Ürünler alınamadı' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ message: 'Ürün bulunamadı' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, price, description, category, imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Geçersiz kategori ID' });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: 'Kategori bulunamadı' });
    }

    const product = new Product({
      name,
      price,
      description,
      category: existingCategory._id,
      imageUrl,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ürün oluşturulurken hata oluştu' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).json({ message: 'Ürün bulunamadı' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, imageUrl } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, imageUrl },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(400).json({ message: 'Ürün bulunamadı' });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error('Güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    // Ürünü sil
    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return res.status(400).json({ message: 'Ürün bulunamadı' });
    }

    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
