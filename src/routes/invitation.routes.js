import express from 'express';
const router = express.Router();

import {
  respondToInvite,
  getMyInvites,
} from '../controllers/invitation.controller.js';
import authenticate from '../middleware/authMiddleware.js';

router.post('/:id/respond', authenticate(), respondToInvite);
router.get('/me', authenticate(), getMyInvites);

export default router;
