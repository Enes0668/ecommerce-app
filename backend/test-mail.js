// test-mail.js
const sendEmail = require('./utils/email'); // doğru klasörse çalışır

sendEmail(
  'melihenes2@gmail.com',
  'Test Mail',
  'Bu bir test e-postasıdır. Sunucudan gönderildi.'
)
  .then(() => console.log('✅ E-posta gönderildi!'))
  .catch((err) => console.error('❌ E-posta gönderilemedi:', err));
