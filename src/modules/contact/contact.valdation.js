import Joi from 'joi';

export const addMessageSchema = Joi.object({
  message: Joi.string().min(2).max(50).required(),
});

export const deleteMessageSchema  = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

