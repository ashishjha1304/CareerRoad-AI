import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { roadmapService } from '../services/roadmapService';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const generateRoadmap = async (req: AuthRequest, res: Response) => {
  const { careerPath } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  try {
    const roadmap = await roadmapService.generateRoadmap(userId, careerPath);
    return successResponse(res, roadmap, 'Roadmap generated successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to generate roadmap');
  }
};

export const getRoadmap = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  try {
    const roadmap = await roadmapService.getRoadmap(userId);
    return successResponse(res, roadmap, 'Roadmap retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to retrieve roadmap');
  }
};
