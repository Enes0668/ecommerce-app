/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Ürün kategorileri işlemleri
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Tüm kategorileri listele
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Başarıyla kategoriler getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Yeni kategori ekle
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Elektronik
 *     responses:
 *       201:
 *         description: Kategori başarıyla oluşturuldu
 *       400:
 *         description: Kategori oluşturulamadı
 */


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
