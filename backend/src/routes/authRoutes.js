import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { loginValidation, validate } from '../middlewares/validationMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginValidation, validate, login);
router.get('/me', authMiddleware, getMe);

export default router;
