import joi from 'joi';

export const addProductSchema = joi.object({
  title: joi.string()
    .min(2)
    .required()
    .messages({
      'string.base': 'Title must be a string.',
      'string.min': 'Title must be at least {#limit} characters long.',
      'any.required': 'Product title is required.'
    }),
  price: joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Price must be a number.',
      'number.min': 'Price cannot be less than {#limit}.',
      'any.required': 'Product price is required.'
    }),
  description: joi.string()
    .min(5)
    .max(300)
    .required()
    .messages({
      'string.base': 'Description must be a string.',
      'string.min': 'Description must be at least {#limit} characters long.',
      'string.max': 'Description cannot be more than {#limit} characters long.',
      'any.required': 'Product description is required.'
    }),
  quantity: joi.number()
    .default(0)
    .min(0)
    .required()
    .messages({
      'number.base': 'Quantity must be a number.',
      'number.min': 'Quantity cannot be less than {#limit}.',
      'any.required': 'Product quantity is required.'
    }),
  imgCover: joi.string()
  .optional()
    .messages({
      'string.base': 'Image cover must be a string.',
    }),
  images: joi.array().items()
    .messages({
      'array.base': 'Images must be an array of strings.'
    }),
  category: joi.string().required().hex().length(24)
    .messages({
      'string.base': 'Category must be a string.',
      'any.required': 'Product category is required.'
    }),
  subCategory: joi.string().required().hex().length(24)
    .messages({
      'string.base': 'Subcategory must be a string.',
      'any.required': 'Product subcategory is required.'
    }),
  brand: joi.string().required().hex().length(24)
    .messages({
      'string.base': 'Brand must be a string.',
      'any.required': 'Product brand is required.'
    })
});
