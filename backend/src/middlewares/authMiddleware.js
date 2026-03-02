import mongoose from 'mongoose';
import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import Admin from '../models/Admin.js';

// Temporary hardcoded admin for testing without MongoDB
const TEMP_ADMIN = {
  _id: 'temp-admin-id',
  email: 'admin@pasuai.online',
  name: 'Admin User',
  role: 'ADMIN',
  isActive: true,
};

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return errorResponse(res, 'No token provided', 401);
    }

    const decoded = verifyToken(token);

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      // Use temporary admin when MongoDB is not connected
      if (decoded.id === TEMP_ADMIN._id) {
        req.admin = TEMP_ADMIN;
        return next();
      }
      return errorResponse(res, 'Admin not found', 401);
    }

    // Normal MongoDB authentication
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return errorResponse(res, 'Admin not found', 401);
    }

    if (!admin.isActive) {
      return errorResponse(res, 'Account is inactive', 403);
    }

    req.admin = admin;
    next();
  } catch (error) {
    return errorResponse(res, error.message || 'Invalid token', 401);
  }
};
