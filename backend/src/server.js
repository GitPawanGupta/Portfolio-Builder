import app from './app.js';
import connectDB from './config/db.js';
import { config } from './config/env.js';
import mailService from './services/mailService.js';

const startServer = async () => {
  try {
    // Try to connect to MongoDB (non-blocking)
    const mongoConnected = await connectDB();

    // Verify email service (optional)
    if (config.email.host && config.email.user) {
      await mailService.verifyConnection();
    } else {
      console.warn('⚠️  Email service not configured');
    }

    // Start server regardless of MongoDB connection
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`💾 Storage: ${config.storage.type}`);
      console.log(`🗄️  MongoDB: ${mongoConnected ? '✅ Connected' : '❌ Not Connected'}`);
      console.log('🚀 ========================================');
      console.log('');
      
      if (!mongoConnected) {
        console.log('⚠️  WARNING: MongoDB is not connected!');
        console.log('💡 To use all features, please:');
        console.log('   1. Install MongoDB: https://www.mongodb.com/try/download/community');
        console.log('   2. Start MongoDB service');
        console.log('   3. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
        console.log('');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
