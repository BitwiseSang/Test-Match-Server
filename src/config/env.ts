import dotenv from 'dotenv';
dotenv.config();

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value as string;
}

export const env = {
  PORT: parseInt(getEnv('PORT', false)) || 4000,
  DATABASE_URL: getEnv('DATABASE_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
};
