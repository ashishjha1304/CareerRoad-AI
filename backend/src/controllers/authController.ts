import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const signup = async (req: Request, res: Response) => {
  const { id, email, full_name, career_goal } = req.body;

  try {
    // We use the ID passed from frontend or fallback to looking up
    let userId = id;

    if (!userId) {
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;
      const authUser = users.find(u => u.email === email);
      if (!authUser) {
        return successResponse(res, null, 'Account created partially. Profile sync might need retry.', 201);
      }
      userId = authUser.id;
    }

    let finalFullName = full_name;
    let finalCareerGoal = career_goal;
    let finalEmail = email;

    // Proactively fetch User from Auth to get Email and Metadata if anything is missing
    if (!finalEmail || !finalFullName || !finalCareerGoal) {
      console.log('Fetching user data from Auth for sync:', userId);
      const { data: { user: authUser }, error: fetchError } = await supabase.auth.admin.getUserById(userId);
      
      if (!fetchError && authUser) {
        finalFullName = finalFullName || authUser.user_metadata?.full_name || '';
        finalCareerGoal = finalCareerGoal || authUser.user_metadata?.career_goal || '';
        finalEmail = finalEmail || authUser.email || '';
      }
    }

    console.log('SYNCING: Upserting profile for:', finalEmail);

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([{ 
          id: userId, 
          email: finalEmail, 
          full_name: finalFullName, 
          career_goal: finalCareerGoal,
          updated_at: new Date()
      }], { onConflict: 'id' });

    if (profileError) {
      console.error('Profile Upsert Error:', profileError);
    }

    return successResponse(res, { id: userId, email: finalEmail }, 'Profile sync completed', 201);
  } catch (error: any) {
    console.error('Backend Signup Sync Error:', error);
    return errorResponse(res, error.message || 'Profile sync failed', 400);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return successResponse(res, { user: data.user, session: data.session }, 'Login successful');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Authentication failed', 401);
  }
};
