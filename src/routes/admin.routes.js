import express from 'express';
const router = express.Router();

// Import modules
import adminMiddleware from '../middleware/admin.middleware.js';
import {
  getAdminCycleById,
  getAllCyclesForAdmin,
} from '../controllers/testCycle.controller.js';
import authenticate from '../middleware/authMiddleware.js';

// Admin Routes
router.get(
  '/test-cycles/:id',
  authenticate(),
  adminMiddleware,
  getAdminCycleById
);

router.get(
  '/test-cycles/',
  authenticate(),
  adminMiddleware,
  getAllCyclesForAdmin
);

export default router;
