import express from 'express';
import {
  createTestCycle,
  updateTestCycle,
  getTestCycles,
  getClientCycleById,
} from '../controllers/testCycle.controller.js';
import authenticate from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import { getInvitesForCycle } from '../controllers/invitation.controller.js';

const router = express.Router();

router.post('/', authenticate('CLIENT'), createTestCycle);
router.patch('/:id', authenticate(), updateTestCycle);
router.get('/', authenticate(), getTestCycles);
router.get(
  '/:id/invitations',
  authenticate(),
  adminMiddleware,
  getInvitesForCycle
);
router.get('/cycle/:id', authenticate(), getClientCycleById);

export default router;
