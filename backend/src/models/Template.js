import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    config: {
      type: Object,
      required: true,
      default: {
        layout: 'modern',
        colorScheme: {
          primary: '#3b82f6',
          secondary: '#1e40af',
          accent: '#60a5fa',
        },
        sections: ['header', 'about', 'experience', 'skills', 'contact'],
        customCSS: '',
      },
    },
    previewUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
templateSchema.index({ name: 1 });

const Template = mongoose.model('Template', templateSchema);

export default Template;
