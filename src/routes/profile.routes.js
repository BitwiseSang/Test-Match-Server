import { Router } from 'express';
const router = Router();
import {
  getTesterProfile,
  getClientProfile,
} from '../controllers/profile.controller.js';
import authenticate from '../middleware/authMiddleware.js';

router.get('/tester/profile', authenticate(), getTesterProfile);
router.get('/client/profile', authenticate(), getClientProfile);

export default router;
