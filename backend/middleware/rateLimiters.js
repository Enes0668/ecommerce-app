const { rateLimit } = require('express-rate-limit');

// Global API limiter (örnek)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,           // 15 dk
  limit: 300,                          // IP başına 15 dk'da 300 istek
  standardHeaders: 'draft-7',          // RateLimit header'larını gönder
  legacyHeaders: false,
});

// Login’de brute-force’a karşı iki katman: IP ve hesap (email) bazlı
const loginIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,                           // IP başına 10 deneme/15dk
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { status: 'fail', message: 'Çok fazla giriş denemesi. Bir süre sonra tekrar deneyin.' },
});

// E-mail bazlı limiter: aynı hesaba art arda deneme
const loginAccountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,                            // aynı e-posta için 5 deneme/15dk
  keyGenerator: (req) => (req.body && req.body.email ? `acct:${req.body.email}` : req.ip),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { status: 'fail', message: 'Bu hesap için çok fazla deneme yapıldı. Bir süre sonra tekrar deneyin.' },
});

module.exports = { apiLimiter, loginIpLimiter, loginAccountLimiter };
