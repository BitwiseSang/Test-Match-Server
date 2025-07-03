import {
  getClientsProfile,
  getTestersProfile,
} from '../services/profile.service.js';

export async function getTesterProfile(req, res) {
  try {
    const profile = await getTestersProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getClientProfile(req, res) {
  try {
    const profile = await getClientsProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
