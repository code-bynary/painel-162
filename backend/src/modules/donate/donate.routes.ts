import { Router } from 'express';
import { getPackages, createPayment, confirmMockPayment } from './donate.controller';
import { authenticateToken } from '../auth/auth.middleware';

const router = Router();

router.get('/packages', authenticateToken, getPackages);
router.post('/create', authenticateToken, createPayment);
router.get('/confirm-mock/:transactionId', confirmMockPayment); // Public endpoint for testing

export default router;
