import express from 'express';

import {
  registerDevice,
  updateDevice,
  getUserDevices,
} from '../controllers/device.controller.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// ROUTES
router.post('/device', authenticate(), registerDevice);
router.patch('/device/:id', authenticate(), updateDevice);
router.get('/device', authenticate(), getUserDevices);

export default router;
