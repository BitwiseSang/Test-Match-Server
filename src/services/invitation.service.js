import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function respondToInvitation(testerId, invitationId, newStatus) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { testCycle: true },
  });

  if (!invitation) throw new Error('Invitation not found');
  if (invitation.testerId !== testerId) throw new Error('Not your invitation');
  if (invitation.status === newStatus)
    throw new Error(`Already ${newStatus.toLowerCase()}`);

  const testCycleId = invitation.testCycleId;

  // Check current accepted count
  const acceptedCount = await prisma.invitation.count({
    where: {
      testCycleId,
      status: 'ACCEPTED',
    },
  });

  const maxSlots = invitation.testCycle.slots;

  // If accepting now, and cycle is full, reject
  if (newStatus === 'ACCEPTED') {
    if (acceptedCount >= maxSlots) {
      throw new Error('No available slots');
    }
  }

  // If declining a previously accepted invite, we still update (slots freed automatically via count logic)

  const updated = await prisma.invitation.update({
    where: { id: invitationId },
    data: {
      status: newStatus,
      respondedAt: new Date(),
    },
  });

  return updated;
}

export async function getMyInvitations(testerId) {
  const invites = await prisma.invitation.findMany({
    where: {
      testerId,
    },
    include: {
      testCycle: {
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          status: true,
        },
      },
    },
    orderBy: {
      sentAt: 'desc',
    },
  });

  return invites;
}

export async function getInvitationsForCycleSummary(testCycleId) {
  const invitations = await prisma.invitation.findMany({
    where: { testCycleId },
    include: {
      tester: {
        select: {
          email: true,
        },
      },
    },
    orderBy: { sentAt: 'desc' },
  });

  const summary = {
    total: invitations.length,
    accepted: 0,
    declined: 0,
    pending: 0,
  };

  const formatted = invitations.map((invite) => {
    summary[invite.status.toLowerCase()]++;

    return {
      id: invite.id,
      email: invite.tester.email,
      status: invite.status,
      sentAt: invite.sentAt,
      respondedAt: invite.respondedAt,
    };
  });

  return { summary, invitations: formatted };
}

export async function getInvitationsByTestCycle(testCycleId) {
  return prisma.invitation.findMany({
    where: { testCycleId },
    include: {
      tester: {
        select: {
          id: true,
          email: true,
          location: true,
        },
      },
    },
    orderBy: { sentAt: 'desc' },
  });
}
