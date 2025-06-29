import { Router } from 'express';
import {
  registerTester,
  loginTester,
  registerClient,
  loginClient,
} from '../controllers/auth.controller';
import { upload } from '../middleware/upload';

const router = Router();

// TESTER ROUTES
router.post('/tester/register', upload.single('avatar'), registerTester);
router.post('/tester/login', loginTester);

// CLIENT ROUTES
router.post('/client/register', upload.single('avatar'), registerClient);
router.post('/client/login', loginClient);

export default router;
