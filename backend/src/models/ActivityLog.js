import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    action: {
      type: String,
      enum: ['STATUS_CHANGED', 'NOTE_ADDED', 'PORTFOLIO_SENT', 'PORTFOLIO_GENERATED'],
      required: true,
    },
    byAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    meta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
activityLogSchema.index({ leadId: 1 });
activityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
