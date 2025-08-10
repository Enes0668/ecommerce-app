require('dotenv').config();
const request = require('supertest');
const app = require('../server');  // Express app'iniz burada export edilmiş olmalı
const User = require('../models/User');
const mongoose = require('mongoose');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_USER_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API', () => {
  let token;
  let userId;

  test('POST /api/register - Yeni kullanıcı oluşturmalı', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        email: 'test@gmail.com',
        password: 'Password1!',
        confirmPassword: 'Password1!',
        phone: '05551234567',
        address: 'Ankara, Turkey'
      });

    if (res.statusCode !== 201) {
      console.log('Register hata:', res.body);
    }

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Kullanıcı başarıyla oluşturuldu.');

    const user = await User.findOne({ email: 'test@gmail.com' });
    expect(user).not.toBeNull();
    userId = user._id.toString();
  });

  test('POST /api/login - Kullanıcı giriş yapmalı', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test@gmail.com',
        password: 'Password1!',
      });

    if (res.statusCode !== 200) {
      console.log('Login hata:', res.body);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

});
