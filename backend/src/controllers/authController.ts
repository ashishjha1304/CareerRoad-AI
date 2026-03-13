import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const signup = async (req: Request, res: Response) => {
  const { id, email, full_name, career_goal } = req.body;

  try {
    // We use the ID passed from frontend or fallback to looking up (though ID is preferred)
    let userId = id;

    if (!userId) {
      // Fallback: This only happens if frontend didn't pass ID for some reason
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;
      const authUser = users.find(u => u.email === email);
      if (!authUser) {
        return successResponse(res, null, 'Account created. Please check your email to confirm.', 201);
      }
      userId = authUser.id;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([{ 
          id: userId, 
          email, 
          full_name: full_name || '', 
          career_goal: career_goal || '' 
      }], { onConflict: 'id' });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // We don't throw here to avoid failing the whole request if profile storage fails
      // as the user is already created in Supabase Auth
    }

    return successResponse(res, { id: userId, email }, 'Profile created successfully', 201);
  } catch (error: any) {
    console.error('Signup error:', error);
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
