import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function registerDevice(userId, data) {
  // Check for duplicates
  const normalizedOS = data.os.toUpperCase(); // "Android" => "ANDROID"
  const normalizedType = data.type.toUpperCase(); // "mobile" => "MOBILE"

  const existing = await prisma.device.findFirst({
    where: {
      userId,
      os: normalizedOS,
      osVersion: data.osVersion,
      brand: data.brand,
      model: data.model,
    },
  });

  console.log(existing);

  if (existing) {
    throw new Error('Device already registered');
  }

  return await prisma.device.create({
    data: {
      userId,
      type: normalizedType,
      os: normalizedOS,
      osVersion: data.osVersion,
      brand: data.brand,
      model: data.model,
    },
  });
}

export async function updateDevice(userId, deviceId, data) {
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  if (!device || device.userId !== userId) {
    throw new Error('Device not found or not authorized');
  }

  return await prisma.device.update({
    where: { id: deviceId },
    data,
  });
}

export async function getUserDevices(userId) {
  return await prisma.device.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }, // optional, if createdAt exists
  });
}

export async function deleteDevices(userId, deviceId) {
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
  });

  // Checking if device exists.
  if (!device || device.userId !== userId) {
    throw new Error('Device not found or unauthorized');
  }

  // Deleting device, only if it exists.
  await prisma.device.delete({
    where: { id: deviceId },
  });

  return { message: 'Device deleted' };
}

// ADMIN//

// Get all devices

export async function getAllDevicesForAdmin() {
  return await prisma.device.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}
