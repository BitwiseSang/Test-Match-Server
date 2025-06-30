import express from 'express';

import {
  registerDevice,
  updateDevice,
  getUserDevices,
  deleteDevices,
  getAllDevicesForAdmin,
} from '../controllers/device.controller.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// ROUTES
router.post('/device', authenticate(), registerDevice);
router.patch('/device/:id', authenticate(), updateDevice);
router.get('/device', authenticate(), getUserDevices);
router.delete('/device/:id', authenticate(), deleteDevices);

//ADMIN
router.get('/admin/devices', authenticate('ADMIN'), getAllDevicesForAdmin);

export default router;
