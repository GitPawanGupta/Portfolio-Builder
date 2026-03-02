import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: [true, 'Experience years is required'],
      min: [0, 'Experience years cannot be negative'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    budget: {
      type: Number,
      min: 0,
    },
    message: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
    },
    resumePath: {
      type: String,
      required: [true, 'Resume path is required'],
    },
    status: {
      type: String,
      enum: ['NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'],
      default: 'NEW',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    notes: [noteSchema],
    source: {
      type: String,
      default: 'Direct',
    },
    trackingId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ trackingId: 1 });
leadSchema.index({ createdAt: -1 });

// Generate tracking ID before saving
leadSchema.pre('save', function (next) {
  if (!this.trackingId) {
    this.trackingId = uuidv4().split('-')[0].toUpperCase();
  }
  next();
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
