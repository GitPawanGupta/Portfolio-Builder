import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Server will start without MongoDB. Some features may not work.');
    console.warn('💡 Please check:');
    console.warn('   1. MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)');
    console.warn('   2. Network/firewall settings');
    console.warn('   3. MongoDB URI credentials');
    return false;
  }
};

export default connectDB;
