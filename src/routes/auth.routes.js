import { Router } from 'express';
import {
  registerTester,
  loginTester,
  registerClient,
  loginClient,
  updateTesterProfile,
  updateClientProfile,
} from '../controllers/auth.controller.js';
import { upload } from '../middleware/upload.js';
import authenticate from '../middleware/authMiddleware.js';

const router = Router();

// TESTER ROUTES
router.post('/tester/register', upload.single('avatar'), registerTester);
router.post('/tester/login', loginTester);

// CLIENT ROUTES
router.post('/client/register', upload.single('avatar'), registerClient);
router.post('/client/login', loginClient);

// UPDATE PROFILE ROUTES
router.patch(
  '/tester/profile',
  authenticate('TESTER'),
  upload.single('avatar'),
  updateTesterProfile
);
router.patch(
  '/client/profile',
  authenticate('CLIENT'),
  upload.single('avatar'),
  updateClientProfile
);

export default router;
