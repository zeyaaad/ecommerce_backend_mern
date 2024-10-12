import Joi from 'joi';

export const addCartShcema = Joi.object({
  product: Joi.string().length(24).hex().required()
});

export const updateCartShcema = Joi.object({
  id: Joi.string().length(24).hex().required(),
  quantity:Joi.number().min(1).required()
});
export const deleteFromCartShcema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});
export const applyCouponSchema = Joi.object({
  code: Joi.string()
    .min(3)
    .max(15)
    .required()
    .messages({
      'string.empty': 'Code is required',       
      'string.min': 'Code must be at least 3 characters',  
      'string.max': 'Code must not exceed 15 characters'  
    })
});




