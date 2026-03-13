import express from 'express';
import { createOrder, verifyPayment, getPaymentStatus } from '../controllers/paymentController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticate);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/status', getPaymentStatus);

export default router;
