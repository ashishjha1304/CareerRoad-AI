import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../config/supabase';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) return errorResponse(res, 'Unauthorized', 401);

  try {
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    // If profile doesn't exist in DB yet (race condition or sync failed)
    if (!profile) {
      console.log('Profile missing, fetching from Auth metadata for:', userId);
      const { data: { user }, error: authError } = await supabase.auth.admin.getUserById(userId);
      
      if (authError || !user) throw new Error('User not found in Auth');

      // Create the missing profile record
      const newProfile = {
        id: userId,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        career_goal: user.user_metadata?.career_goal || '',
        subscription_status: 'free',
        updated_at: new Date()
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        console.error('Lazy profile creation failed:', createError);
        // Fallback to sending the objects we constructed
        return successResponse(res, newProfile, 'Profile constructed from Auth metadata');
      }
      
      profile = createdProfile;
    }

    return successResponse(res, profile, 'Profile fetched successfully');
  } catch (error: any) {
    console.error('getProfile Error:', error);
    return errorResponse(res, error.message || 'Failed to fetch profile');
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { full_name, career_goal } = req.body;

  if (!userId) return errorResponse(res, 'Unauthorized', 401);

  try {
    // Only allow updating full_name. career_goal is permanent.
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ full_name, updated_at: new Date() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return successResponse(res, profile, 'Profile updated successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to update profile');
  }
};
