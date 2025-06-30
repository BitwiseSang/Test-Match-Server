import express from 'express';
import {
  createTestCycle,
  updateTestCycle,
  getTestCycles,
} from '../controllers/testCycle.controller.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/test-cycles', authenticate('CLIENT'), createTestCycle);
router.patch('/test-cycles/:id', authenticate(), updateTestCycle);
router.get('/test-cycles', authenticate(), getTestCycles);

export default router;
