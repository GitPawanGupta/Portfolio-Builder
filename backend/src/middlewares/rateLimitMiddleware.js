import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const publicFormLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.publicMax,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many form submissions, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
