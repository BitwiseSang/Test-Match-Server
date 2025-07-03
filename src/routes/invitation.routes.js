import express from 'express';
const router = express.Router();

import {
  respondToInvite,
  getMyInvites,
  getInvitesByTestCycle,
} from '../controllers/invitation.controller.js';
import authenticate from '../middleware/authMiddleware.js';

router.post('/:id/respond', authenticate(), respondToInvite);
router.get('/me', authenticate('TESTER'), getMyInvites);
router.get('/test-cycle/:id', authenticate('CLIENT'), getInvitesByTestCycle);

export default router;
