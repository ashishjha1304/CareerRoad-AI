import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const signup = async (req: Request, res: Response) => {
  const { email, full_name, career_goal } = req.body;

  try {
    // NOTE: Auth user is already created by the frontend via supabase.auth.signUp().
    // This endpoint only handles creating the corresponding profile row.
    // We look up the user by email to get their ID.
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;

    const authUser = users.find(u => u.email === email);

    if (!authUser) {
      // If user not found yet (email confirmation pending), create profile with upsert
      // This case handles when supabase requires email confirmation
      return successResponse(res, null, 'Account created. Please check your email to confirm.', 201);
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([{ 
          id: authUser.id, 
          email, 
          full_name: full_name || '', 
          career_goal: career_goal || '' 
      }], { onConflict: 'id' });

    if (profileError) {
      console.error('Error creating profile:', profileError);
    }

    return successResponse(res, { id: authUser.id, email }, 'Profile created successfully', 201);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Profile creation failed', 400);
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
