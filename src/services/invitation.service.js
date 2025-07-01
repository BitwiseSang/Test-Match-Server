import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function respondToInvitation(
  testerId,
  invitationId,
  responseStatus
) {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: { testCycle: true },
  });

  if (!invitation) throw new Error('Invitation not found');
  if (invitation.testerId !== testerId) throw new Error('Not your invitation');
  if (invitation.status !== 'PENDING') throw new Error('Already responded');

  if (responseStatus === 'ACCEPTED') {
    // Count already accepted testers for this test cycle
    const acceptedCount = await prisma.invitation.count({
      where: {
        testCycleId: invitation.testCycleId,
        status: 'ACCEPTED',
      },
    });

    if (acceptedCount >= invitation.testCycle.slots) {
      throw new Error('Test cycle is already full');
    }
  }

  const updated = await prisma.invitation.update({
    where: { id: invitationId },
    data: {
      status: responseStatus,
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
