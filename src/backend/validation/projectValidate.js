const Joi = require("joi");

const projectSchema = Joi.object({
    channelName: Joi.string().required().messages({
        "string.empty": "Channel Name is required",
    }),
    channelId: Joi.string().required().messages({
        "string.empty": "Channel ID is required",
    }),
    price: Joi.number().required().messages({
        "number.base": "Price must be a number",
        "any.required": "Price is required",
    }),
    monthly: Joi.boolean().required().messages({
        "boolean.base": "Monthly must be a boolean",
        "any.required": "Monthly is required",
    }),
    description: Joi.string().optional(),
});

module.exports = projectSchema;
