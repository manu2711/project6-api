// Validation
const Joi = require('@hapi/joi')

// Register Validation
exports.register = function registerValidation (data) {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9-@/+*!%&.]*$'))
  })
  return schema.validate(data)
}

// Sauce Validation
exports.sauce = function sauceValidation (data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9À-ÿ-!&?,.\' ]*$')),
    manufacturer: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9À-ÿ-!&?,.\' ]*$')),
    description: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9À-ÿ-!&?,.\' ]*$')),
    mainPepper: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9À-ÿ-!&?,.\' ]*$')),
    heat: Joi.number().required(),
    userId: Joi.string().required()
  })
  return schema.validate(data)
}
