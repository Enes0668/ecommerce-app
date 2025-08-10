require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Express app

const User = require('../models/User');
const Otp = require('../models/Otp');

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_RESETPASSWORD_TEST_URI);
    console.log('MongoDB bağlantısı başarılı.');
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  await Otp.deleteMany({});

  const user = new User({
    username: 'testuser' + Date.now(),  // benzersiz yap
    email: 'test@example.com',
    password: '$2a$10$wWZk3qjh2JwJ3h/....'
  });
  await user.save();

  const otp = new Otp({
    email: user.email,
    otp: '123456',
    createdAt: new Date()
  });
  await otp.save();
});

afterEach(async () => {
  await User.deleteMany({});
  await Otp.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe('POST /api/auth/reset-password', () => {
  it('Doğru email ve OTP ile şifre sıfırlama başarılı olmalı', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password') // burayı kontrol et, app'deki path neyse onu yaz
      .send({ email: 'test@example.com', otp: '123456', newPassword: 'YeniSifre1!' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Şifre başarıyla değiştirildi');
  });

  it('Geçersiz OTP ile hata dönmeli', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'test@example.com', otp: '000000', newPassword: 'YeniSifre1!' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('OTP geçersiz veya süresi dolmuş');
  });

  it('Kullanıcı bulunamazsa hata dönmeli', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ email: 'olmayan@example.com', otp: '123456', newPassword: 'YeniSifre1!' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Kullanıcı bulunamadı');
  });
});
