// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // Kategori adı
  slug: { type: String, required: true, unique: true },  // SEO için URL dostu isim
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
