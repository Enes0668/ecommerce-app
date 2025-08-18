// CommonJS örneği
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp'); // opsiyonel
const mongoSanitize = require('express-mongo-sanitize'); // opsiyonel

function securityMiddlewares(app) {
  // Eğer reverse proxy (NGINX/Heroku vb.) arkasındaysan:
  // Rate limit’in gerçek IP’yi görmesi için:
  app.set('trust proxy', 1); // prod'da önerilir. :contentReference[oaicite:7]{index=7}

  // JSON body limitini makul tut (DoS'a karşı)
  app.use(require('express').json({ limit: '200kb' }));

  // Helmet (genel)
  app.use(helmet());

  // Swagger UI path’inde CSP sorunlarını önlemek için
  // iki yoldan biri:
  // A) Swagger route’unu Helmet'ten önce mount et (en kolayı)
  // B) Sadece /api-docs için CSP’yi gevşet:
  // app.use('/api-docs', helmet({ contentSecurityPolicy: false }));

  // XSS sanitize (req.body, req.query, req.params, req.headers)
  app.use(xss());

  // Opsiyonel katmanlar:
  app.use(hpp());             // parametre pollution önler
  app.use(mongoSanitize());   // $gt, $ne gibi op. enjeksiyonlarına karşı
}

module.exports = { securityMiddlewares };
