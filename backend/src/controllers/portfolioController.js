import Lead from '../models/Lead.js';
import Template from '../models/Template.js';
import Portfolio from '../models/Portfolio.js';
import ActivityLog from '../models/ActivityLog.js';
import mailService from '../services/mailService.js';
import whatsappService from '../services/whatsappService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const generatePortfolio = async (req, res) => {
  try {
    const { leadId, templateId } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    const template = await Template.findById(templateId);
    if (!template) {
      return errorResponse(res, 'Template not found', 404);
    }

    // Simple portfolio URL generation (in production, generate actual HTML)
    const portfolioUrl = `${process.env.APP_URL || 'http://localhost:5000'}/portfolio/${lead.trackingId}`;
    const pdfUrl = null; // Optional: implement PDF generation with Puppeteer

    const portfolio = await Portfolio.create({
      leadId,
      templateId,
      portfolioUrl,
      pdfUrl,
    });

    // Create activity log
    await ActivityLog.create({
      leadId,
      action: 'PORTFOLIO_GENERATED',
      byAdminId: req.admin._id,
      meta: { templateId, portfolioUrl },
    });

    return successResponse(res, {
      portfolioUrl,
      pdfUrl,
      portfolioId: portfolio._id,
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const sendPortfolio = async (req, res) => {
  try {
    const { leadId, via, portfolioUrl, pdfUrl } = req.body;

    if (!['EMAIL', 'WHATSAPP'].includes(via)) {
      return errorResponse(res, 'Invalid delivery method', 400);
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    const portfolio = await Portfolio.findOne({ leadId });
    if (!portfolio) {
      return errorResponse(res, 'Portfolio not found. Please generate portfolio first.', 404);
    }

    try {
      if (via === 'EMAIL') {
        await mailService.sendPortfolioEmail(lead, portfolioUrl, pdfUrl);
        portfolio.sentOnEmail = true;
      } else if (via === 'WHATSAPP') {
        await whatsappService.sendPortfolioMessage(lead, portfolioUrl);
        portfolio.sentOnWhatsApp = true;
      }

      portfolio.sentAt = new Date();
      await portfolio.save();

      // Create activity log
      await ActivityLog.create({
        leadId,
        action: 'PORTFOLIO_SENT',
        byAdminId: req.admin._id,
        meta: { sentVia: via, portfolioUrl },
      });

      return successResponse(res, {
        sent: true,
        sentAt: portfolio.sentAt,
        via,
      });
    } catch (sendError) {
      return errorResponse(res, `Failed to send via ${via}: ${sendError.message}`, 500);
    }
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
