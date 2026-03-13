import express from 'express';
import { updateSkillStatus } from '../controllers/skillController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { updateSkillSchema } from '../validators/roadmapValidator';

const router = express.Router();

router.use(authenticate);

router.post('/update', validate(updateSkillSchema), updateSkillStatus);

export default router;
