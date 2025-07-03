import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getTestersProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      location: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!user) throw new Error('Tester not found');
  return user;
}

export async function getClientsProfile(clientId) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      id: true,
      companyName: true,
      email: true,
      location: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!client) throw new Error('Client not found');
  return client;
}
