const Joi = require('joi');

const defaultOptions = {
  abortEarly: false,     // tüm hataları topla
  allowUnknown: false,   // şemada olmayan alanları reddet
  stripUnknown: true,    // şemada olmayanları sil
};

function validate(schema, target = 'body', options = {}) {
  return (req, res, next) => {
    const data = req[target];
    const { error, value } = schema.validate(data, { ...defaultOptions, ...options });
    if (error) {
      return res.status(400).json({
        status: 'fail',
        errors: error.details.map(d => ({ message: d.message, path: d.path })),
      });
    }
    req[target] = value;
    next();
  };
}

module.exports = { validate, Joi };
