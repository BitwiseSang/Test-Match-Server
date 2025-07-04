import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes.js';
import deviceRoutes from './routes/device.routes.js';
import testCycleRoutes from './routes/testCycle.routes.js';
import invitationRoutes from './routes/invitation.routes.js';
import adminRoutes from './routes/admin.routes.js';
import profileRoutes from './routes/profile.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/', deviceRoutes);
app.use('/api/test-cycles', testCycleRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/', profileRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
