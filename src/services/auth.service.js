import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export async function registerTester(data) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
      location: data.location,
      role: Role.TESTER,
      avatar: data.avatar,
    },
  });

  return generateToken({ id: user.id, role: user.role });
}

export async function loginTester(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  return generateToken({ id: user.id, role: user.role });
}

export async function registerClient(data) {
  const existing = await prisma.client.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(data.password, 10);
  const client = await prisma.client.create({
    data: {
      email: data.email,
      password: hashed,
      companyName: data.companyName,
      contactName: data.contactName,
      location: data.location,
      avatar: data.avatar,
    },
  });

  return generateToken({ id: client.id, role: 'CLIENT' });
}

export async function loginClient(email, password) {
  const client = await prisma.client.findUnique({ where: { email } });
  if (!client) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, client.password);
  if (!valid) throw new Error('Invalid credentials');

  return generateToken({ id: client.id, role: 'CLIENT' });
}
