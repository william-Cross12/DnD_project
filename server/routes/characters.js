const express = require('express');
const { nanoid } = require('nanoid');
const { DB, persist } = require('../db');
const router = express.Router();

// Create character
router.post('/', (req, res) => {
  const { campaignId, playerId, name, sheet } = req.body;
  const camp = DB.campaigns[campaignId];
  if (!camp) return res.status(404).json({ error: 'no campaign' });

  const charId = nanoid(8);
  camp.characters = camp.characters || {};
  camp.characters[charId] = { id: charId, playerId, name, sheet };
  persist();
  res.json(camp.characters[charId]);
});

// Get all characters in a campaign
router.get('/:campaignId', (req, res) => {
  const camp = DB.campaigns[req.params.campaignId];
  if (!camp) return res.status(404).json({ error: 'no campaign' });
  res.json(camp.characters || {});
});

// Update character
router.put('/:campaignId/:charId', (req, res) => {
  const { campaignId, charId } = req.params;
  const camp = DB.campaigns[campaignId];
  if (!camp || !camp.characters[charId]) return res.status(404).json({ error: 'character not found' });

  Object.assign(camp.characters[charId], req.body);
  persist();
  res.json(camp.characters[charId]);
});

module.exports = router;
