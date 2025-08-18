const { Joi } = require('../middleware/validate');

const email = Joi.string().email().lowercase().trim().required();
const password = Joi.string()
  .min(8).max(64)
  // en az bir harf ve sayı (istersen özel karakteri de zorunlu kıl)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .required()
  .messages({
    'string.pattern.base': 'Şifre en az bir harf ve bir rakam içermeli',
  });

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(60).trim().required(),
  email,
  password,
});

const loginSchema = Joi.object({
  email,
  password: Joi.string().min(8).max(64).required(),
});

module.exports = { registerSchema, loginSchema };
