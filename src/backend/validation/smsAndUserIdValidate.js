const Joi = require("joi");

const smsAndUserIdValidate = Joi.object({
    userId: Joi.string().required().error(new Error("User ID xato")),
    smsCode: Joi.string()
        .pattern(/^[0-9]+$/)
        .required()
        .error(new Error("SMS kod xato")),
});

module.exports = smsAndUserIdValidate;
