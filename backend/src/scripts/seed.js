import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Template from '../models/Template.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create default admin
    const adminExists = await Admin.findOne({ email: 'admin@pasuai.online' });
    if (!adminExists) {
      await Admin.create({
        email: 'admin@pasuai.online',
        password: 'admin123',
        name: 'Admin User',
        role: 'ADMIN',
      });
      console.log('✅ Default admin created');
      console.log('   Email: admin@pasuai.online');
      console.log('   Password: admin123');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Create default template
    const templateExists = await Template.findOne({ name: 'Modern Professional' });
    if (!templateExists) {
      await Template.create({
        name: 'Modern Professional',
        description: 'A clean and modern portfolio template with a professional look',
        config: {
          layout: 'modern',
          colorScheme: {
            primary: '#3b82f6',
            secondary: '#1e40af',
            accent: '#60a5fa',
            background: '#ffffff',
            text: '#1f2937',
          },
          sections: ['header', 'about', 'experience', 'skills', 'education', 'contact'],
          customCSS: '',
        },
        isActive: true,
      });
      console.log('✅ Default template created');
    } else {
      console.log('ℹ️  Template already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
