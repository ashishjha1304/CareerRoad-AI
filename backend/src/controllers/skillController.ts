import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../config/supabase';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const updateSkillStatus = async (req: AuthRequest, res: Response) => {
  const { skillId, status } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  try {
    // Step 1: Update the skill
    const { data: skill, error } = await supabase
      .from('skills')
      .update({ status })
      .eq('id', skillId)
      .select('*, stages!inner(roadmap_id)')
      .single();

    if (error) throw error;

    // Step 2: Get the roadmap ID from the skill's stage
    const roadmapId = (skill as any).stages?.roadmap_id;

    if (roadmapId) {
      // Step 3: Get all stage IDs for this roadmap
      const { data: stages } = await supabase
        .from('stages')
        .select('id')
        .eq('roadmap_id', roadmapId);
      
      const stageIds = stages?.map((s: any) => s.id) || [];

      // Step 4: Count completed skills across those stages
      const { count, error: countError } = await supabase
        .from('skills')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed')
        .in('stage_id', stageIds);

      if (!countError && count !== null) {
        await supabase
          .from('roadmaps')
          .update({ completed_skills: count })
          .eq('id', roadmapId);
      }
    }

    return successResponse(res, skill, 'Skill updated successfully');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to update skill status');
  }
};
