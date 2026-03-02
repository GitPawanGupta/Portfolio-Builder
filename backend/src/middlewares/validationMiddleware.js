import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fields = {};
    errors.array().forEach((error) => {
      fields[error.path] = error.msg;
    });
    return errorResponse(res, 'Validation failed', 400, fields);
  }
  next();
};

export const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('experienceYears').isInt({ min: 0 }).withMessage('Experience years must be a positive number'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('message').optional().trim(),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const templateValidation = [
  body('name').trim().notEmpty().withMessage('Template name is required'),
  body('description').optional().trim(),
  body('config').isObject().withMessage('Config must be an object'),
];
