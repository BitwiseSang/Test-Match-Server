import express from 'express';
import {
  createTestCycle,
  updateTestCycle,
} from '../controllers/testCycle.controller.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/test-cycles', authenticate('CLIENT'), createTestCycle);
router.patch('/test-cycles/:id', authenticate(), updateTestCycle);

export default router;
