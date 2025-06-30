import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createTestCycle(clientId, data) {
  return await prisma.testCycle.create({
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
}

export async function updateTestCycle(user, cycleId, updates) {
  const cycle = await prisma.testCycle.findUnique({ where: { id: cycleId } });

  if (!cycle) throw new Error('Test cycle not found');

  // only the client who owns it or an admin can update
  if (user.role !== 'ADMIN' && user.id !== cycle.clientId) {
    throw new Error('Not authorized to update this cycle');
  }

  return await prisma.testCycle.update({
    where: { id: cycleId },
    data: {
      title: updates.title,
      description: updates.description,
      requiredOS: updates.requiredOS?.map((os) => os.toLowerCase()),
      requiredDevices: updates.requiredDevices?.map((d) => d.toLowerCase()),
      requiredLocation: updates.requiredLocation?.map((loc) =>
        loc.toLowerCase()
      ),
      slots: updates.slots,
      startDate: updates.startDate ? new Date(updates.startDate) : undefined,
      endDate: updates.endDate ? new Date(updates.endDate) : undefined,
      status: user.role === 'ADMIN' ? updates.status : undefined,
    },
  });
}
