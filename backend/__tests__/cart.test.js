require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Cart = require('../models/Cart');
const Product = require('../models/Product'); // Product modelini import et

describe('Cart Routes', () => {
  let userId;
  let productId;
  let cartItemId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_CART_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Testten önce tüm sepet ve ürünleri temizle
    await Cart.deleteMany({});
    await Product.deleteMany({});

    userId = new mongoose.Types.ObjectId().toString();

    // Gerçek bir ürün oluştur
    const product = new Product({
      name: 'Test Ürün',
      price: 100,
      categoryName: 'Test Kategori',
      slug: 'test-urun-' + new mongoose.Types.ObjectId().toString(),
    });
    const savedProduct = await product.save();
    productId = savedProduct._id.toString();

    // Sepete ürün ekle
    const cartItem = new Cart({
      userId,
      productId,
      name: savedProduct.name,
      price: savedProduct.price,
      quantity: 1,
      categoryName: savedProduct.categoryName,
    });
    const savedCartItem = await cartItem.save();
    cartItemId = savedCartItem._id.toString();
  });

  test('GET /api/cart/user/:userId - Kullanıcının sepetini döndürmeli', async () => {
    const res = await request(app).get(`/api/cart/user/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    // productId dolu ve içindeki name alanı 'Test Ürün' olmalı
    expect(res.body[0].productId.name).toBe('Test Ürün');
  });

  test('POST /cart - Yeni ürün eklemeli', async () => {
  // Yeni ürün oluştur
  const newProduct = new Product({
    name: 'Yeni Ürün',
    price: 150,
    categoryName: 'Yeni Kategori',
  });
  const savedNewProduct = await newProduct.save();

  const res = await request(app).post('/api/cart').send({
    userId,
    productId: savedNewProduct._id.toString(),
    name: savedNewProduct.name,
    price: savedNewProduct.price,
    categoryName: savedNewProduct.categoryName,
  });

  console.log('POST /api/cart response:', res.body);

  expect(res.statusCode).toBe(201);
  expect(res.body.productId).toBe(savedNewProduct._id.toString());
  expect(res.body.quantity).toBe(1);
});


  test('POST /api/cart/cart - Aynı ürünü eklerse quantity artmalı', async () => {
    const res = await request(app).post('/api/cart').send({
      userId,
      productId,
      name: 'Test Ürün',
      price: 100,
      categoryName: 'Test Kategori',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(2);
  });

  test('PUT /api/cart/:id - Ürün miktarını güncellemeli', async () => {
    const res = await request(app).put(`/api/cart/${cartItemId}`).send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Ürün miktarı güncellendi');

    const updatedItem = await Cart.findById(cartItemId);
    expect(updatedItem.quantity).toBe(5);
  });

  test('DELETE /api/cart/clear/:userId - Kullanıcının sepetini temizlemeli', async () => {
    // Sepete başka bir ürün daha ekle
    const anotherProduct = new Product({
      name: 'İkinci Ürün',
      price: 200,
      categoryName: 'Kategori 2',
    });
    const savedAnotherProduct = await anotherProduct.save();

    await new Cart({
      userId,
      productId: savedAnotherProduct._id.toString(),
      name: savedAnotherProduct.name,
      price: savedAnotherProduct.price,
      quantity: 1,
      categoryName: savedAnotherProduct.categoryName,
    }).save();

    const res = await request(app).delete(`/api/cart/clear/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Sepet başarıyla temizlendi');
    expect(res.body.deletedCount).toBe(2);

    const remainingItems = await Cart.find({ userId });
    expect(remainingItems.length).toBe(0);
  });
});
