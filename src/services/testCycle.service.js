import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { matchEligibleTesters } from './match.service.js';

export async function createTestCycle(clientId, data) {
  const newCycle = await prisma.testCycle.create({
    data: {
      clientId,
      title: data.title,
      description: data.description,
      requiredOS: data.requiredOS.map((os) => os.toLowerCase()),
      requiredDevices: data.requiredDevices.map((d) => d.toLowerCase()),
      requiredLocation: data.requiredLocation.map((loc) => loc.toLowerCase()),
      slots: data.slots,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });
  await matchEligibleTesters(newCycle.id);

  return newCycle;
}

export async function updateTestCycle(user, id, updates) {
  // Fetch the cycle
  const cycle = await prisma.testCycle.findUnique({
    where: { id },
  });

  if (!cycle) throw new Error('Test cycle not found');

  // Only client owner or admin can edit
  if (user.role !== 'ADMIN' && user.id !== cycle.clientId) {
    throw new Error('Not authorized to edit this test cycle');
  }

  // Prevent editing if already ended
  if (new Date(cycle.endDate) < new Date()) {
    throw new Error('Cannot edit a test cycle that has ended');
  }

  // Optional: filter only editable fields
  const editable = [
    'title',
    'description',
    'requiredLocation',
    'requiredOS',
    'requiredDevices',
    'slots',
    'startDate',
    'endDate',
  ];
  const data = {};
  for (const key of editable) {
    if (updates[key] !== undefined) data[key] = updates[key];
  }

  const updated = await prisma.testCycle.update({
    where: { id },
    data,
  });

  return updated;
}

export async function getTestCyclesForUser(user) {
  const whereClause =
    user.role === 'CLIENT' ? { clientId: user.id } : undefined; // ADMIN fetches all

  return await prisma.testCycle.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });
}
