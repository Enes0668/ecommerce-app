/**
 * @swagger
 * /api/payment/create-payment-intent:
 *   post:
 *     summary: Stripe ödeme isteği oluşturur
 *     description: Stripe üzerinden ödeme intenti başlatır.
 *     responses:
 *       200:
 *         description: Ödeme intenti başarıyla oluşturuldu.
 */

// routes/payment.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const Stripe = require('stripe').default;  // BURAYI DÜZELT
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Stripe secret key .env dosyasında olmalı

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { items, amount } = req.body;

    // Eğer fiyatı frontend’den aldıysan bu örnek şu şekilde olacak:
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 50, // Kuruş cinsinden. Örnek: 1000 kuruş = 10 TL
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret, amount: paymentIntent.amount });
  } catch (error) {
    console.error('Payment Intent oluşturulamadı:', error);
    res.status(500).json({ error: 'Ödeme isteği oluşturulamadı' });
  }
});

module.exports = router;
