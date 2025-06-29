import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Create tester
  await prisma.user.upsert({
    where: { email: 'tester1@example.com' },
    update: {},
    create: {
      email: 'tester1@example.com',
      password,
      name: 'Tester One',
      role: 'TESTER',
      location: 'Kenya',
    },
  });

  // Create admin
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      name: 'Admin Guy',
      role: 'ADMIN',
      location: 'USA',
    },
  });

  // Create client
  await prisma.client.upsert({
    where: { email: 'client1@example.com' },
    update: {},
    create: {
      email: 'client1@example.com',
      password,
      companyName: 'TestCorp',
      contactName: 'Client Alpha',
      location: 'UK',
    },
  });

  console.log('Seed data created!');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
