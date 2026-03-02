import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './src/models/Admin.js';
import Template from './src/models/Template.js';

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin
    await Admin.deleteMany({ email: 'admin@pasuai.online' });
    console.log('✅ Deleted existing admin');

    // Create new admin
    await Admin.create({
      email: 'admin@pasuai.online',
      password: 'PasuAI@2026',
      name: 'Admin User',
      role: 'ADMIN',
    });
    console.log('✅ New admin created');
    console.log('   Email: admin@pasuai.online');
    console.log('   Password: PasuAI@2026');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetAdmin();
