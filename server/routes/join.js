const express = require('express');
const { nanoid } = require('nanoid');
const { DB, persist } = require('../db');
const router = express.Router();

// Join via invite
router.post('/', (req, res) => {
  const { token, name } = req.body;
  if (!token || !DB.invites[token]) return res.status(400).json({ error: 'invalid invite' });
  const invite = DB.invites[token];
  if (invite.expiresAt < Date.now()) return res.status(400).json({ error: 'invite expired' });

  const camp = DB.campaigns[invite.campaignId];
  if (!camp) return res.status(404).json({ error: 'campaign missing' });

  const userId = nanoid(8);
  const role = Object.keys(camp.users).length === 0 ? 'gm' : 'player';
  const user = { id: userId, name: name || 'Player', role };
  camp.users[userId] = user;
  persist();

  res.json({ user, campaign: camp });
});

module.exports = router;
