import Lead from '../models/Lead.js';
import Portfolio from '../models/Portfolio.js';
import ActivityLog from '../models/ActivityLog.js';
import { getFileStorage } from '../services/fileService.js';
import { successResponse, errorResponse } from '../utils/response.js';

const fileStorage = getFileStorage();

export const createLead = async (req, res) => {
  try {
    // Check if MongoDB is connected
    const mongoose = await import('mongoose');
    const isMongoConnected = mongoose.default.connection.readyState === 1;

    if (!isMongoConnected) {
      return errorResponse(res, 'Database not connected. Please contact administrator.', 503);
    }

    if (!req.file) {
      return errorResponse(res, 'Resume file is required', 400);
    }

    const { name, email, phone, role, experienceYears, city, budget, message, source } = req.body;

    // Upload file
    const fileResult = await fileStorage.uploadFile(req.file, 'resumes');

    const lead = await Lead.create({
      name,
      email,
      phone,
      role,
      experienceYears: parseInt(experienceYears),
      city,
      budget: budget ? parseFloat(budget) : undefined,
      message,
      resumeUrl: fileResult.url,
      resumePath: fileResult.path,
      source: source || 'Direct',
    });

    return successResponse(
      res,
      {
        trackingId: lead.trackingId,
        message: 'Lead submitted successfully! We will contact you soon.',
      },
      201
    );
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const trackLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findOne({ trackingId: id }).select('name status createdAt');

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, { lead });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const retrieveTrackingId = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 'Email is required', 400);
    }

    // Check if MongoDB is connected
    const mongoose = await import('mongoose');
    const isMongoConnected = mongoose.default.connection.readyState === 1;

    if (!isMongoConnected) {
      return errorResponse(res, 'Database not connected. Please contact administrator.', 503);
    }

    const lead = await Lead.findOne({ email: email.toLowerCase() })
      .select('name email trackingId createdAt')
      .sort({ createdAt: -1 }); // Get most recent application

    if (!lead) {
      return errorResponse(res, 'No application found with this email', 404);
    }

    return successResponse(res, {
      trackingId: lead.trackingId,
      name: lead.name,
      email: lead.email,
      appliedDate: lead.createdAt,
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getLeads = async (req, res) => {
  try {
    // Check if MongoDB is connected
    const mongoose = await import('mongoose');
    const isMongoConnected = mongoose.default.connection.readyState === 1;

    if (!isMongoConnected) {
      // Return empty data when MongoDB is not connected
      return successResponse(res, {
        leads: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          pages: 0,
        },
      });
    }

    const { status, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Lead.countDocuments(query);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const leads = await Lead.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email')
      .select('-notes');

    return successResponse(res, {
      leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    const portfolio = await Portfolio.findOne({ leadId: id }).populate('templateId', 'name');
    const activityLog = await ActivityLog.find({ leadId: id })
      .populate('byAdminId', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, {
      lead,
      portfolio,
      activityLog,
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo } = req.body;

    const lead = await Lead.findById(id);

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    // Validate status transition
    if (status && status !== lead.status) {
      const validTransitions = {
        NEW: ['IN_PROGRESS', 'REJECTED'],
        IN_PROGRESS: ['COMPLETED', 'REJECTED'],
        COMPLETED: [],
        REJECTED: [],
      };

      if (!validTransitions[lead.status].includes(status)) {
        return errorResponse(res, `Invalid status transition from ${lead.status} to ${status}`, 400);
      }

      const oldStatus = lead.status;
      lead.status = status;

      // Create activity log
      await ActivityLog.create({
        leadId: id,
        action: 'STATUS_CHANGED',
        byAdminId: req.admin._id,
        meta: { oldStatus, newStatus: status },
      });
    }

    if (notes) {
      lead.notes.push({
        text: notes,
        addedBy: req.admin._id,
      });

      // Create activity log
      await ActivityLog.create({
        leadId: id,
        action: 'NOTE_ADDED',
        byAdminId: req.admin._id,
        meta: { noteText: notes },
      });
    }

    if (assignedTo) {
      lead.assignedTo = assignedTo;
    }

    await lead.save();

    const updatedLead = await Lead.findById(id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email');

    return successResponse(res, { lead: updatedLead });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getDashboard = async (req, res) => {
  try {
    // Check if MongoDB is connected
    const mongoose = await import('mongoose');
    const isMongoConnected = mongoose.default.connection.readyState === 1;

    if (!isMongoConnected) {
      // Return dummy data when MongoDB is not connected
      return successResponse(res, {
        new: 0,
        inProgress: 0,
        completed: 0,
        rejected: 0,
        total: 0,
      });
    }

    const [newCount, inProgressCount, completedCount, rejectedCount, totalCount] = await Promise.all([
      Lead.countDocuments({ status: 'NEW' }),
      Lead.countDocuments({ status: 'IN_PROGRESS' }),
      Lead.countDocuments({ status: 'COMPLETED' }),
      Lead.countDocuments({ status: 'REJECTED' }),
      Lead.countDocuments(),
    ]);

    return successResponse(res, {
      new: newCount,
      inProgress: inProgressCount,
      completed: completedCount,
      rejected: rejectedCount,
      total: totalCount,
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const exportLeads = async (req, res) => {
  try {
    const { status, search } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    // Generate CSV
    const csvHeader = 'Name,Email,Phone,Role,Experience Years,City,Budget,Status,Source,Created Date\n';
    const csvRows = leads.map((lead) => {
      return [
        lead.name,
        lead.email,
        lead.phone,
        lead.role,
        lead.experienceYears,
        lead.city,
        lead.budget || '',
        lead.status,
        lead.source,
        lead.createdAt.toISOString().split('T')[0],
      ].join(',');
    });

    const csv = csvHeader + csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    return res.send(csv);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
