import { z } from 'zod';

// Now accepts any free-text career path (not locked to 4 options)
export const generateRoadmapSchema = z.object({
  body: z.object({
    careerPath: z.string().min(2, 'Career path is too short').max(200, 'Career path is too long'),
  }),
});

export const updateSkillSchema = z.object({
  body: z.object({
    skillId: z.string().uuid({ message: 'Invalid Skill ID format (UUID required)' }),
    status: z.enum(['pending', 'in_progress', 'completed']),
  }),
});
