import express from 'express';
import {
  createTestCycle,
  updateTestCycle,
  getTestCycles,
} from '../controllers/testCycle.controller.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate('CLIENT'), createTestCycle);
router.patch('/:id', authenticate(), updateTestCycle);
router.get('/', authenticate(), getTestCycles);

export default router;
