import multer from 'multer';

const storage = multer.memoryStorage(); // store file in memory as buffer

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
