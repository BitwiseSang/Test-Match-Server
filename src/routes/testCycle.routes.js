import express from 'express';
import { createTestCycle } from '../controllers/testCycle.controller.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/test-cycles', authenticate('CLIENT'), createTestCycle);

export default router;
