import Joi from 'joi';

export const addToWishListShcema = Joi.object({
  product: Joi.string().length(24).hex().required()
});

export const deleteFromWishListShcema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});


