import * as InvitationService from '../services/invitation.service.js';

export async function respondToInvite(req, res) {
  try {
    const { status } = req.body;
    const valid = ['ACCEPTED', 'DECLINED'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = await InvitationService.respondToInvitation(
      req.user.id,
      req.params.id,
      status
    );

    res.json({ message: 'Invitation response saved', result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getMyInvites(req, res) {
  try {
    const invites = await InvitationService.getMyInvitations(req.user.id);
    res.json(invites);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getInvitesForCycle(req, res) {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await InvitationService.getInvitationsForCycleSummary(
      req.params.id
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
