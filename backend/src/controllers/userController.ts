import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../config/supabase';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) return errorResponse(res, 'Unauthorized', 401);

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return successResponse(res, profile, 'Profile fetched successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to fetch profile');
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { full_name, career_goal } = req.body;

  if (!userId) return errorResponse(res, 'Unauthorized', 401);

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ full_name, career_goal, updated_at: new Date() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return successResponse(res, profile, 'Profile updated successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to update profile');
  }
};
