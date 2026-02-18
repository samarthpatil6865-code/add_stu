import Joi from 'joi';

// Student validation schemas
export const createStudentSchema = Joi.object({
  name: Joi.string().required().min(1).max(100).messages({
    'string.empty': 'Student name is required',
    'string.min': 'Student name cannot be empty',
    'string.max': 'Student name cannot exceed 100 characters',
    'any.required': 'Student name is required',
  }),
  rollNo: Joi.string().required().min(1).max(20).messages({
    'string.empty': 'Roll number is required',
    'string.min': 'Roll number cannot be empty',
    'string.max': 'Roll number cannot exceed 20 characters',
    'any.required': 'Roll number is required',
  }),
  class: Joi.string().required().pattern(/^([1-9]|10)$/).messages({
    'string.empty': 'Class is required',
    'string.pattern.base': 'Class must be between 1 and 10',
    'any.required': 'Class is required',
  }),
  section: Joi.string().required().valid('A', 'B').messages({
    'string.empty': 'Section is required',
    'any.only': 'Section must be either A or B',
    'any.required': 'Section is required',
  }),
  gender: Joi.string().required().valid('Male', 'Female', 'Other').messages({
    'string.empty': 'Gender is required',
    'any.only': 'Gender must be Male, Female, or Other',
    'any.required': 'Gender is required',
  }),
  address: Joi.string().required().min(1).max(500).messages({
    'string.empty': 'Address is required',
    'string.min': 'Address cannot be empty',
    'string.max': 'Address cannot exceed 500 characters',
    'any.required': 'Address is required',
  }),
  photo: Joi.string().optional().uri().messages({
    'string.uri': 'Photo must be a valid URL',
  }),
  dateOfBirth: Joi.date().optional().max('now').messages({
    'date.max': 'Date of birth cannot be in the future',
  }),
  parentName: Joi.string().optional().max(100).messages({
    'string.max': 'Parent name cannot exceed 100 characters',
  }),
  contactNumber: Joi.string().optional().pattern(/^[0-9]{10}$/).messages({
    'string.pattern.base': 'Contact number must be a valid 10-digit number',
  }),
  email: Joi.string().optional().email().messages({
    'string.email': 'Email must be a valid email address',
  }),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().optional().min(1).max(100),
  rollNo: Joi.string().optional().min(1).max(20),
  class: Joi.string().optional().pattern(/^([1-9]|10)$/),
  section: Joi.string().optional().valid('A', 'B'),
  gender: Joi.string().optional().valid('Male', 'Female', 'Other'),
  address: Joi.string().optional().min(1).max(500),
  photo: Joi.string().optional().uri(),
  dateOfBirth: Joi.date().optional().max('now'),
  parentName: Joi.string().optional().max(100),
  contactNumber: Joi.string().optional().pattern(/^[0-9]{10}$/),
  email: Joi.string().optional().email(),
  isActive: Joi.boolean().optional(),
});

export const studentQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  class: Joi.string().optional().pattern(/^([1-9]|10)$/),
  section: Joi.string().optional().valid('A', 'B'),
  gender: Joi.string().optional().valid('Male', 'Female', 'Other'),
  search: Joi.string().optional().max(100),
  sortBy: Joi.string().optional().valid('name', 'rollNo', 'class', 'createdAt', 'updatedAt').default('createdAt'),
  sortOrder: Joi.string().optional().valid('asc', 'desc').default('desc'),
  isActive: Joi.boolean().optional(),
});

export const studentParamsSchema = Joi.object({
  id: Joi.string().required().hex().length(24).messages({
    'string.hex': 'Invalid student ID format',
    'string.length': 'Invalid student ID format',
    'any.required': 'Student ID is required',
  }),
});
