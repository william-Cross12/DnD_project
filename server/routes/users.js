const express = require('express');
const { DB, persist } = require('../db');
const router = express.Router();

// Update player permissions
router.put('/:campaignId/:userId/permissions', (req, res) => {
  const { campaignId, userId } = req.params;
  const camp = DB.campaigns[campaignId];
  if (!camp || !camp.users[userId]) return res.status(404).json({ error: 'user not found' });

  camp.users[userId].permissions = req.body.permissions;
  persist();
  res.json(camp.users[userId]);
});

module.exports = router;
