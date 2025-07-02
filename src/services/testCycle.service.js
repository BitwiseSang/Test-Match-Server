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

export async function getClientTestCycleById(clientId, cycleId) {
  const cycle = await prisma.testCycle.findUnique({
    where: { id: cycleId },
    include: {
      invitations: {
        include: {
          tester: {
            select: { id: true, email: true },
          },
        },
      },
    },
  });

  if (!cycle) throw new Error('Test cycle not found');
  if (cycle.clientId !== clientId) throw new Error('Unauthorized');

  // Build status counts
  const stats = { accepted: 0, declined: 0, pending: 0 };
  for (const invite of cycle.invitations) {
    stats[invite.status.toLowerCase()]++;
  }

  const isExpired = new Date(cycle.endDate) < new Date();
  const cycleStatus = isExpired
    ? 'EXPIRED'
    : stats.accepted >= cycle.slots
    ? 'FILLED'
    : 'OPEN';

  return {
    id: cycle.id,
    title: cycle.title,
    description: cycle.description,
    requiredLocation: cycle.requiredLocation,
    requiredOS: cycle.requiredOS,
    requiredDevices: cycle.requiredDevices,
    slots: cycle.slots,
    startDate: cycle.startDate,
    endDate: cycle.endDate,
    status: cycleStatus,
    stats,
    invitations: cycle.invitations.map((inv) => ({
      id: inv.id,
      status: inv.status,
      sentAt: inv.sentAt,
      respondedAt: inv.respondedAt,
      tester: inv.tester,
    })),
  };
}

export async function getTestCycleByIdForAdmin(cycleId) {
  const cycle = await prisma.testCycle.findUnique({
    where: { id: cycleId },
    include: {
      client: {
        select: { id: true, companyName: true, email: true },
      },
      invitations: {
        include: {
          tester: {
            select: { id: true, email: true },
          },
        },
      },
    },
  });

  if (!cycle) throw new Error('Test cycle not found');

  const stats = { accepted: 0, declined: 0, pending: 0 };
  for (const invite of cycle.invitations) {
    stats[invite.status.toLowerCase()]++;
  }

  const isExpired = new Date(cycle.endDate) < new Date();
  const cycleStatus = isExpired
    ? 'EXPIRED'
    : stats.accepted >= cycle.slots
    ? 'FILLED'
    : 'OPEN';

  return {
    id: cycle.id,
    title: cycle.title,
    description: cycle.description,
    requiredLocation: cycle.requiredLocation,
    requiredOS: cycle.requiredOS,
    requiredDevices: cycle.requiredDevices,
    slots: cycle.slots,
    startDate: cycle.startDate,
    endDate: cycle.endDate,
    status: cycleStatus,
    stats,
    client: cycle.client,
    invitations: cycle.invitations.map((inv) => ({
      id: inv.id,
      status: inv.status,
      sentAt: inv.sentAt,
      respondedAt: inv.respondedAt,
      tester: inv.tester,
    })),
  };
}

export async function getAllTestCyclesForAdmin() {
  const cycles = await prisma.testCycle.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: { id: true, companyName: true, email: true },
      },
      invitations: {
        select: { status: true },
      },
    },
  });

  return cycles.map((cycle) => {
    const stats = { accepted: 0, declined: 0, pending: 0 };

    for (const invite of cycle.invitations) {
      stats[invite.status.toLowerCase()]++;
    }

    const isExpired = new Date(cycle.endDate) < new Date();
    const status = isExpired
      ? 'EXPIRED'
      : stats.accepted >= cycle.slots
      ? 'FILLED'
      : 'OPEN';

    return {
      id: cycle.id,
      title: cycle.title,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      slots: cycle.slots,
      status,
      stats,
      client: cycle.client,
    };
  });
}

export async function cleanupExpiredTestCycles() {
  const now = new Date();

  const cycles = await prisma.testCycle.findMany({
    where: {
      OR: [
        { endDate: { lt: now } },
        { status: 'OPEN' }, // in case slots filled recently
      ],
    },
    include: {
      invitations: {
        where: { status: 'PENDING' },
      },
    },
  });

  const updates = [];

  for (const cycle of cycles) {
    const acceptedCount = await prisma.invitation.count({
      where: {
        testCycleId: cycle.id,
        status: 'ACCEPTED',
      },
    });

    const shouldExpire =
      new Date(cycle.endDate) < now || acceptedCount >= cycle.slots;

    if (shouldExpire && cycle.status !== 'EXPIRED') {
      // Update cycle status
      await prisma.testCycle.update({
        where: { id: cycle.id },
        data: { status: 'CLOSED' },
      });

      // Expire all pending invites
      await prisma.invitation.updateMany({
        where: {
          testCycleId: cycle.id,
          status: 'PENDING',
        },
        data: {
          status: 'CLOSED',
          respondedAt: now,
        },
      });

      updates.push(cycle.id);
    }
  }

  return {
    updatedCycles: updates.length,
    expiredIds: updates,
  };
}

export async function updateTestCycleStatus(cycleId, newStatus, user) {
  const allowedStatuses = ['COMPLETED', 'CANCELLED'];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error('Invalid status update');
  }

  const cycle = await prisma.testCycle.findUnique({
    where: { id: cycleId },
  });

  if (!cycle) throw new Error('Test cycle not found');
  if (cycle.status === 'COMPLETED' || cycle.status === 'CANCELLED') {
    throw new Error(`Cannot update a ${cycle.status} cycle`);
  }

  if (user.role === 'CLIENT' && cycle.clientId !== user.id) {
    throw new Error('Unauthorized: not your test cycle');
  }

  // Perform status update
  await prisma.testCycle.update({
    where: { id: cycleId },
    data: { status: newStatus },
  });

  if (newStatus === 'CANCELLED') {
    // Expire all pending invites
    await prisma.invitation.updateMany({
      where: {
        testCycleId: cycleId,
        status: 'PENDING',
      },
      data: {
        status: 'EXPIRED',
        respondedAt: new Date(),
      },
    });
  }

  return { updated: true, status: newStatus };
}

export async function getAcceptedTesters(testCycleId, requester) {
  // Verify test cycle exists
  const testCycle = await prisma.testCycle.findUnique({
    where: { id: testCycleId },
  });

  if (!testCycle) throw new Error('Test cycle not found');

  // Only the owning client or admin can access
  if (requester.role === 'CLIENT' && requester.id !== testCycle.clientId) {
    throw new Error('Unauthorized');
  }

  const acceptedInvites = await prisma.invitation.findMany({
    where: {
      testCycleId,
      status: 'ACCEPTED',
    },
    include: {
      tester: {
        select: {
          id: true,
          email: true,
          name: true,
          location: true,
          devices: true,
        },
      },
    },
  });

  return acceptedInvites.map((invite) => ({
    testerId: invite.tester.id,
    email: invite.tester.email,
    name: invite.tester.name,
    location: invite.tester.location,
    devices: invite.tester.devices,
    acceptedAt: invite.respondedAt,
  }));
}

export async function fetchOpenTestCycles() {
  return await prisma.testCycle.findMany({
    where: {
      status: 'OPEN',
      endDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
