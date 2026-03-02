import express from 'express';
import { createLead, trackLead, retrieveTrackingId } from '../controllers/leadController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { leadValidation, validate } from '../middlewares/validationMiddleware.js';
import { publicFormLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

router.post('/', publicFormLimiter, upload.single('resume'), leadValidation, validate, createLead);
router.get('/track/:id', trackLead);
router.post('/retrieve-tracking-id', publicFormLimiter, retrieveTrackingId);

export default router;
