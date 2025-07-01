import express from 'express';
const router = express.Router();

import { respondToInvite } from '../controllers/invitation.controller.js';
import authenticate from '../middleware/authMiddleware.js';

router.post('/:id/respond', authenticate(), respondToInvite);

export default router;
