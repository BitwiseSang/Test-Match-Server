import * as DeviceService from '../services/device.service.js';

export async function registerDevice(req, res) {
  try {
    const device = await DeviceService.registerDevice(req.user.id, req.body);
    res.status(201).json({ message: 'Device registered', device });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateDevice(req, res) {
  try {
    const device = await DeviceService.updateDevice(
      req.user.id,
      req.params.id,
      req.body
    );
    res.status(200).json({ message: 'Device updated', device });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getUserDevices(req, res) {
  try {
    const devices = await DeviceService.getUserDevices(req.user.id);
    res.json({ devices });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteDevices(req, res) {
  try {
    const result = await DeviceService.deleteDevices(
      req.user.id,
      req.params.id
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAllDevicesForAdmin(_req, res) {
  try {
    const devices = await DeviceService.getAllDevicesForAdmin();
    res.json({ devices });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
