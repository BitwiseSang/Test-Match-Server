import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes.js';
import deviceRoutes from './routes/device.routes.js';
import testCycleRoutes from './routes/testCycle.routes.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/', deviceRoutes);
app.use('/api/', testCycleRoutes);

app.get('/', async (req, res) => {
  const testers = await prisma.user.findMany();
  res.json(testers);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
