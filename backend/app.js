// app.js
const express = require('express');
const app = express();

// Middleware'ler (JSON parse vs)
app.use(express.json());

// Route'ları buraya ekle
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));

// Hata yakalama middleware'i (opsiyonel)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Bir hata oluştu!');
});

module.exports = app;
