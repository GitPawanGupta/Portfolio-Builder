import express from 'express';
import {
  getLeads,
  getLeadById,
  updateLead,
  getDashboard,
  exportLeads,
} from '../controllers/leadController.js';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
} from '../controllers/templateController.js';
import {
  generatePortfolio,
  sendPortfolio,
} from '../controllers/portfolioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { templateValidation, validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// All admin routes require authentication
router.use(authMiddleware);

// Dashboard
router.get('/dashboard', getDashboard);

// Leads
router.get('/leads', getLeads);
router.get('/leads/:id', getLeadById);
router.patch('/leads/:id', updateLead);

// Templates
router.get('/templates', getTemplates);
router.post('/templates', templateValidation, validate, createTemplate);
router.patch('/templates/:id', templateValidation, validate, updateTemplate);

// Portfolio
router.post('/portfolio/generate', generatePortfolio);
router.post('/portfolio/send', sendPortfolio);

// Export
router.get('/export/leads', exportLeads);

export default router;
