import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { generalLimiter } from './middlewares/rateLimitMiddleware.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Serve uploaded files
app.use('/uploads', express.static(config.storage.uploadDir));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
