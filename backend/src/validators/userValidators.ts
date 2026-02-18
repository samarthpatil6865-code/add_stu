import Joi from 'joi';

// User validation schemas
export const registerSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).pattern(/^[a-zA-Z0-9_]+$/).messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username cannot exceed 30 characters',
    'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
    'any.required': 'Username is required',
  }),
  email: Joi.string().required().email().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  firstName: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'First name is required',
    'string.min': 'First name cannot be empty',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name cannot be empty',
    'string.max': 'Last name cannot exceed 50 characters',
    'any.required': 'Last name is required',
  }),
  role: Joi.string().optional().valid('admin', 'teacher', 'staff').default('staff'),
});

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional().min(1).max(50),
  lastName: Joi.string().optional().min(1).max(50),
  email: Joi.string().optional().email(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
    'any.required': 'Current password is required',
  }),
  newPassword: Joi.string().required().min(6).messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters',
    'any.required': 'New password is required',
  }),
});
