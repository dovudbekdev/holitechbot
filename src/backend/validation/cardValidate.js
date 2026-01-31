const Joi = require("joi");

module.exports = Joi.object({
  userId: Joi.string().required().error(new Error("User ID xato")),
  cardName: Joi.string()
  .max(30)
  .required()
  .error(new Error("Karta nomi xato")),
  cardNumber: Joi.string()
    .pattern(new RegExp("^[0-9]{16}$"))
    .required()
    .error(new Error("Karta raqami xato")),
  expiryDate: Joi.string()
    .pattern(new RegExp("^(0[1-9]|1[0-2])/(2[2-9]|3[0-9]|9[0-9])$")) // MM/YY format
    .required()
    .error(new Error("Amal qilish muddati xato")),
});
