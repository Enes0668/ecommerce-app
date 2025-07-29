const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // userId da ObjectId olabilir
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // burada ObjectId ve ref olmalı
    quantity: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
