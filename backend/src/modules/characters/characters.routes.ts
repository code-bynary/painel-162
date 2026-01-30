import { Router } from 'express';
import { getUserCharacters } from './characters.controller';
import { authenticateToken } from '../auth/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getUserCharacters);

export default router;
