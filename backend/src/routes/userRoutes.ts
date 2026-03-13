import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { updateProfileSchema } from '../validators/authValidator';

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.post('/profile', validate(updateProfileSchema), updateProfile);

export default router;
