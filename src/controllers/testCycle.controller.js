import * as TestCycleService from '../services/testCycle.service.js';

export async function createTestCycle(req, res) {
  try {
    const cycle = await TestCycleService.createTestCycle(req.user.id, req.body);
    res.status(201).json({ message: 'Test cycle created', cycle });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateTestCycle(req, res) {
  try {
    const updated = await TestCycleService.updateTestCycle(
      req.user,
      req.params.id,
      req.body
    );
    res.json({ message: 'Test cycle updated', updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getTestCycles(req, res) {
  try {
    const cycles = await TestCycleService.getTestCyclesForUser(req.user);
    res.json({ cycles });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getClientCycleById(req, res) {
  try {
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const data = await TestCycleService.getClientTestCycleById(
      req.user.id,
      req.params.id
    );

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAdminCycleById(req, res) {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const data = await TestCycleService.getTestCycleByIdForAdmin(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAllCyclesForAdmin(req, res) {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await TestCycleService.getAllTestCyclesForAdmin();
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateTestCycleStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!['ADMIN', 'CLIENT'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const result = await TestCycleService.updateTestCycleStatus(
      id,
      status,
      req.user
    );
    res.json({
      message: `Test cycle marked as ${status}`,
      ...result,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAcceptedTesters(req, res) {
  const { id } = req.params;
  try {
    const testers = await TestCycleService.getAcceptedTesters(id, req.user);
    res.json(testers);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

export async function getOpenTestCycles(_req, res) {
  try {
    const testCycles = await TestCycleService.fetchOpenTestCycles();
    res.json(testCycles);
  } catch (err) {
    console.error('Error fetching open test cycles:', err);
    res.status(500).json({ error: 'Failed to fetch test cycles' });
  }
}
