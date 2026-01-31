const Joi = require("joi");

const projectSchema = Joi.object({
    channelId: Joi.string().required().error(new Error("ID xato")),
});

module.exports = projectSchema;
