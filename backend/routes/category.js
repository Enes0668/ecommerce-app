// routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const slugify = require('slugify');  // Slug oluşturmak için

// Kategori listele
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yeni kategori ekle
router.post('/', async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true });
  const category = new Category({ name, slug });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
