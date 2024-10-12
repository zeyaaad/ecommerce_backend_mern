import joi from 'joi';

export const registerSchema = joi.object({
  name: joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)
    .required()
    .messages({
      'string.base': 'Name must be a string.',
      'string.min': 'Name must be at least {#limit} characters long.',
      'string.max': 'Name cannot be more than {#limit} characters long.',
      'string.pattern.base': 'Name can only contain letters and spaces.',
      'any.required': 'Name is required.'
    }),
  email: joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.'
    }),
  password: joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Password must be a string.',
      'string.min': 'Password must be at least {#limit} characters long.',
      'any.required': 'Password is required.'
    }),
 phone: joi.string()
    .pattern(/^(010|011|012|015)[0-9]{8}$/)
    .required()
    .messages({
      'string.base': 'Phone number must be a string.',
      'string.pattern.base': 'Phone number must be a valid Egyptian number starting with 010, 011, 012, or 015.',
      'any.required': 'Phone number is required.'
    })
});

export const changeDataSchema = joi.object({
  name: joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)
    .optional()
    .messages({
      'string.base': 'Name must be a string.',
      'string.min': 'Name must be at least {#limit} characters long.',
      'string.max': 'Name cannot be more than {#limit} characters long.',
      'string.pattern.base': 'Name can only contain letters and spaces.',
      'any.required': 'Name is required.'
    }),
 phone: joi.string()
    .pattern(/^(010|011|012|015)[0-9]{8}$/)
    .optional()
    .messages({
      'string.base': 'Phone number must be a string.',
      'string.pattern.base': 'Phone number must be a valid Egyptian number starting with 010, 011, 012, or 015.',
      'any.required': 'Phone number is required.'
    })
});
export const loginSchema = joi.object({
  email: joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.'
    }),
  password: joi.string()
    .required()
    .min(6)
    .messages({
      'string.base': 'Password must be a string.',
      'any.required': 'Password is required.'
    })
});

export const changeEmailSchema = joi.object({
  email: joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.'
    })
});


export const cahangePasswordSchema= joi.object({
 
  currentpassword: joi.string()
    .required()
    .min(6)
    .messages({
      'string.base': 'currentpassword must be a string.',
      'any.required': 'currentpassword is required.'
    }),
  password: joi.string()
    .required()
    .min(6)
    .messages({
      'string.base': 'Password must be a string.',
      'any.required': 'Password is required.'
    })
});

export const resetPasswordSchema= joi.object({
 
  newPassword: joi.string()
    .required()
    .min(6)
    .messages({
      'string.base': 'currentpassword must be a string.',
      'any.required': 'currentpassword is required.'
    })
});
