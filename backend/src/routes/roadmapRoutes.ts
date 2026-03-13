import express from 'express';
import { generateRoadmap, getRoadmap } from '../controllers/roadmapController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { generateRoadmapSchema } from '../validators/roadmapValidator';

const router = express.Router();

router.use(authenticate);

router.post('/generate', validate(generateRoadmapSchema), generateRoadmap);
router.get('/', getRoadmap);

export default router;
