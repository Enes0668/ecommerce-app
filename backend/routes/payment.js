const express = require('express');
const router = express.Router();
const stripe = require('../stripe'); // dikkat: ../stripe

router.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body;

  const amount = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // kuruş
      currency: 'try'
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      amount: amount * 100
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
