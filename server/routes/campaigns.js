const express = require('express');
const { nanoid } = require('nanoid');
const { DB, persist } = require('../db');
const router = express.Router();

// Create campaign
router.post('/create-campaign', (req, res) => {
  const name = req.body?.name || 'My Campaign';
  const id = nanoid(8);
  DB.campaigns[id] = {
    id, name, gmId: null, users: {}, map: { image: null, strokes: [], tokens: [] }
  };
  persist();
  res.json({ id });
});

// Invite token
router.post('/:id/invite', (req, res) => {
  const camp = DB.campaigns[req.params.id];
  if (!camp) return res.status(404).json({ error: 'no campaign' });
  const token = nanoid(10);
  DB.invites[token] = { campaignId: camp.id, createdAt: Date.now(), expiresAt: Date.now() + 1000*60*60*24 };
  persist();
  res.json({ token });
});

// Get campaign state
router.get('/:id', (req, res) => {
  const c = DB.campaigns[req.params.id];
  if (!c) return res.status(404).json({ error: 'no campaign' });
  res.json(c);
});

module.exports = router;
