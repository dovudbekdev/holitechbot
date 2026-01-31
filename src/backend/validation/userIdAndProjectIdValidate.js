const Joi = require("joi");

const projectSchema = Joi.object({
    projectId: Joi.string().required().error(   new Error("ID xato")),
    userId: Joi.string().required().error(new Error("User ID xato")),
    duration: Joi.number().required().error(new Error("Amal qilish muddati xato")),
});

module.exports = projectSchema;
