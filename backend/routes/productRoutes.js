/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Ürün yönetimi
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Tüm ürünleri veya kategoriye göre filtrelenmiş ürünleri getir
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrelemek için kategori ID
 *     responses:
 *       200:
 *         description: Ürün listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Sunucu hatası
 *   post:
 *     summary: Yeni ürün oluştur
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Ürün başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Hatalı istek / Kategori bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: ID'ye göre ürün getir
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ürün ID
 *     responses:
 *       200:
 *         description: Ürün bilgisi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ürün bulunamadı
 *       500:
 *         description: Sunucu hatası
 *   put:
 *     summary: Ürünü güncelle
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Güncellenecek ürün ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Ürün başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ürün bulunamadı
 *       500:
 *         description: Sunucu hatası
 *   delete:
 *     summary: Ürünü sil
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Silinecek ürün ID
 *     responses:
 *       200:
 *         description: Ürün başarıyla silindi
 *       400:
 *         description: Ürün bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         imageUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         imageUrl:
 *           type: string
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 */

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
