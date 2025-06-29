import * as AuthService from '../services/auth.service.js';

// AUTH CONTROLLERS

export async function registerTester(req, res) {
  try {
    const avatar = req.file ? req.file.buffer : undefined;
    const token = await AuthService.registerTester({ ...req.body, avatar });
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function loginTester(req, res) {
  try {
    const token = await AuthService.loginTester(
      req.body.email,
      req.body.password
    );
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

export async function registerClient(req, res) {
  try {
    const avatar = req.file ? req.file.buffer : undefined;
    const token = await AuthService.registerClient({ ...req.body, avatar });
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function loginClient(req, res) {
  try {
    const token = await AuthService.loginClient(
      req.body.email,
      req.body.password
    );
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

// PROFILE UPDATE CONTROLLERS

export async function updateTesterProfile(req, res) {
  try {
    const avatar = req.file ? req.file.buffer : undefined;
    const updated = await AuthService.updateTesterProfile(req.user.id, {
      ...req.body,
      avatar,
    });
    res.json({ message: 'Profile updated', updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateClientProfile(req, res) {
  try {
    const avatar = req.file ? req.file.buffer : undefined;
    const updated = await AuthService.updateClientProfile(req.user.id, {
      ...req.body,
      avatar,
    });
    res.json({ message: 'Profile updated', updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
