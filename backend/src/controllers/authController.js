import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Temporary hardcoded admin for testing without MongoDB
const TEMP_ADMIN = {
  _id: 'temp-admin-id',
  email: 'admin@pasuai.online',
  password: 'admin123',
  name: 'Admin User',
  role: 'ADMIN',
  isActive: true,
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      // Use temporary hardcoded admin when MongoDB is not connected
      console.log('⚠️  Using temporary admin (MongoDB not connected)');
      
      if (email !== TEMP_ADMIN.email || password !== TEMP_ADMIN.password) {
        return errorResponse(res, 'Invalid credentials', 401);
      }

      const token = generateToken({ id: TEMP_ADMIN._id, email: TEMP_ADMIN.email });

      return successResponse(res, {
        token,
        admin: {
          id: TEMP_ADMIN._id,
          email: TEMP_ADMIN.email,
          name: TEMP_ADMIN.name,
          role: TEMP_ADMIN.role,
        },
      });
    }

    // Normal MongoDB authentication
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (!admin.isActive) {
      return errorResponse(res, 'Account is inactive', 403);
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken({ id: admin._id, email: admin.email });

    return successResponse(res, {
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getMe = async (req, res) => {
  try {
    // Check if using temporary admin
    if (req.admin.id === TEMP_ADMIN._id) {
      return successResponse(res, {
        admin: {
          id: TEMP_ADMIN._id,
          email: TEMP_ADMIN.email,
          name: TEMP_ADMIN.name,
          role: TEMP_ADMIN.role,
        },
      });
    }

    return successResponse(res, {
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
