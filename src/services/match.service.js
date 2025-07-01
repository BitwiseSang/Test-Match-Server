import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const DEVICE_ENUMS = ['MOBILE', 'TABLET', 'DESKTOP', 'LAPTOP'];
const OS_ENUMS = ['ANDROID', 'IOS', 'WINDOWS', 'MACOS', 'LINUX'];

function normalizeEnumList(input = [], validEnums = []) {
  return input
    .map((i) => i.toUpperCase())
    .filter((i) => validEnums.includes(i));
}

export async function matchEligibleTesters(cycleId) {
  const cycle = await prisma.testCycle.findUnique({
    where: { id: cycleId },
  });

  if (!cycle) throw new Error('Test cycle not found');

  const requiredDevices = normalizeEnumList(
    cycle.requiredDevices,
    DEVICE_ENUMS
  );
  const requiredOS = normalizeEnumList(cycle.requiredOS, OS_ENUMS);
  const requiredLocation = cycle.requiredLocation.map((loc) =>
    loc.toUpperCase()
  );

  // Debug
  const testers = await prisma.user.findMany({
    where: {
      role: 'TESTER',
    },
    include: {
      devices: true,
    },
  });

  const matchingTesters = testers.filter(
    (user) =>
      cycle.requiredLocation.includes(user.location.toLowerCase()) &&
      user.devices.some(
        (device) =>
          requiredDevices.includes(device.type) &&
          requiredOS.includes(device.os)
      )
  );

  const alreadyInvited = await prisma.invitation.findMany({
    where: { testCycleId: cycle.id },
    select: { testerId: true },
  });
  const invitedIds = new Set(alreadyInvited.map((i) => i.testerId));

  const newInvites = matchingTesters
    .filter((t) => !invitedIds.has(t.id))
    .slice(0, cycle.slots)
    .map((tester) => ({
      testCycleId: cycle.id,
      testerId: tester.id,
      status: 'PENDING',
      sentAt: new Date(),
    }));

  console.log(`=== Matching Summary ===`);
  console.log(`Eligible testers found: ${testers.length}`);
  console.log(`Testers matching device + OS: ${matchingTesters.length}`);
  console.log(`Invites to send: ${newInvites.length}`);
  console.log(`========================`);

  if (newInvites.length > 0) {
    await prisma.invitation.createMany({ data: newInvites });
  }

  return {
    matched: newInvites.length,
    totalEligible: testers.length,
    totalMatching: matchingTesters.length,
    totalSlots: cycle.slots,
  };
}
