import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    portfolioUrl: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
    },
    sentOnEmail: {
      type: Boolean,
      default: false,
    },
    sentOnWhatsApp: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
portfolioSchema.index({ leadId: 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
