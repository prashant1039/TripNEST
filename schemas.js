const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required"
    }),

    description: Joi.string().required().messages({
      "string.empty": "Description is required"
    }),

    image: Joi.string().allow("").optional(),

    price: Joi.number().required().min(1).messages({
      "number.base": "Price must be a number",
      "number.min": "Price must be at least 1",
      "any.required": "Price is required"
    }),

    location: Joi.string().required().messages({
      "string.empty": "Location is required"
    }),

    country: Joi.string().required().messages({
      "string.empty": "Country is required"
    }),

    category: Joi.string()
      .valid(
        "Trending",
        "Room",
        "Iconic Cities",
        "Castles",
        "Amazing Pools",
        "Camping",
        "Farm",
        "Arctic"
      )
      .required()
      .messages({
        "any.only": "Invalid category selected",
        "any.required": "Category is required"
      })

  }).required()
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().trim().required()
  }).required()
});

module.exports = { listingSchema, reviewSchema };
