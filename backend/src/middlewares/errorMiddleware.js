import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File size exceeds 10MB limit', 400);
    }
    return errorResponse(res, err.message, 400);
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const fields = {};
    Object.keys(err.errors).forEach((key) => {
      fields[key] = err.errors[key].message;
    });
    return errorResponse(res, 'Validation failed', 400, fields);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field} already exists`, 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  // Sanitize error message in production
  const sanitizedMessage = process.env.NODE_ENV === 'production' 
    ? 'An error occurred' 
    : message;

  return errorResponse(res, sanitizedMessage, statusCode);
};

export const notFoundHandler = (req, res) => {
  return errorResponse(res, 'Route not found', 404);
};
