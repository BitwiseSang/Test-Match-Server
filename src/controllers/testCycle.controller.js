import * as TestCycleService from '../services/testCycle.service.js';

export async function createTestCycle(req, res) {
  try {
    const cycle = await TestCycleService.createTestCycle(req.user.id, req.body);
    res.status(201).json({ message: 'Test cycle created', cycle });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
