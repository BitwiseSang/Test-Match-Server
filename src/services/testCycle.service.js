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
