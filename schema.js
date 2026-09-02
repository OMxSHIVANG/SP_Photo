const Joi = require("joi");

const imageSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "Image title is required.",
            "string.min": "Title must be at least 2 characters long.",
            "string.max": "Title cannot exceed 100 characters."
        }),

    url: Joi.string()
        .allow("", null)
        .optional(),

    category: Joi.string()
        .trim()
        .valid("nature", "animals", "anime", "universe", "other", "all")
        .allow("", null)
        .optional(),

    tags: Joi.alternatives().try(
        Joi.string().allow("", null),
        Joi.array().items(Joi.string())
    ).optional()
});

module.exports = {
    imageSchema
};