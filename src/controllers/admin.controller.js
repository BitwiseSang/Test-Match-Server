import { cleanupExpiredTestCycles } from '../services/testCycle.service.js';

export async function triggerCleanup(req, res) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const result = await cleanupExpiredTestCycles();
    res.json({
      message: 'Expired test cycles cleaned up',
      ...result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
