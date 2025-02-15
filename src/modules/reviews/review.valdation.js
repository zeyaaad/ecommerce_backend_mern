import Joi from 'joi';

export const addReviewSchema = Joi.object({
  product: Joi.string().length(24).hex().required(),
  comment: Joi.string().min(2).max(50).required(),
  rating: Joi.number().min(1).max(5).required(),
});

export const deleteReviewSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
});


export const UpdateReviewSchema = Joi.object({
  id: Joi.string().length(24).hex().required(),
  comment: Joi.string().min(2).max(50).optional(),
  rating: Joi.number().min(1).max(5).optional(),
});
