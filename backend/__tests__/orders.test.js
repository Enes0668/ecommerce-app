// backend/__tests__/orders.test.js
require('dotenv').config();
const request = require('supertest');
const app = require('../server'); // Express app (server.js dosyasında module.exports = app olmalı)
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

describe('🧪 Sipariş Oluşturma Testi', () => {
  let userId;
  let productId;

  beforeAll(async () => {
    // Test için bir kullanıcı ve ürün oluştur
    userId = new mongoose.Types.ObjectId();

    const product = await Product.create({
      name: 'Test Ürünü',
      price: 100,
      description: 'Test açıklama',
      image: 'test.jpg'
    });

    productId = product._id;

    // Sepete ürün ekle
    await Cart.create({
      userId,
      productId,
      quantity: 2
    });
  });

  afterAll(async () => {
    await Cart.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await mongoose.connection.close();
  });

  it('✅ Sepette ürün varsa sipariş oluşturmalı', async () => {
    const res = await request(app)
      .post('/api/orders/create')
      .send({ userId });

    expect(res.status).toBe(201);
    expect(res.body.order).toHaveProperty('items');
    expect(res.body.order.totalPrice).toBeGreaterThan(0);
  });
});
