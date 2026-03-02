import Template from '../models/Template.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isActive: true }).select('-__v');

    return successResponse(res, { templates });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const createTemplate = async (req, res) => {
  try {
    const { name, description, config, previewUrl } = req.body;

    const template = await Template.create({
      name,
      description,
      config,
      previewUrl,
    });

    return successResponse(res, { template }, 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, config, previewUrl, isActive } = req.body;

    const template = await Template.findByIdAndUpdate(
      id,
      { name, description, config, previewUrl, isActive },
      { new: true, runValidators: true }
    );

    if (!template) {
      return errorResponse(res, 'Template not found', 404);
    }

    return successResponse(res, { template });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
