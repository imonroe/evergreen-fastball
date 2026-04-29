const express = require('express');
const { read, write } = require('../lib/dataStore');

const router = express.Router();

router.get('/', (_req, res) => {
  const { preferences } = read();
  res.json(preferences);
});

router.get('/vault-path', (_req, res) => {
  res.json({ vaultPath: process.env.OBSIDIAN_VAULT || '' });
});

router.put('/', (req, res) => {
  const data = read();
  const { enterToAdd, timezone, dailyNoteLinks } = req.body;
  if (typeof enterToAdd === 'boolean') data.preferences.enterToAdd = enterToAdd;
  if (typeof timezone === 'string') data.preferences.timezone = timezone.trim();
  if (typeof dailyNoteLinks === 'boolean') data.preferences.dailyNoteLinks = dailyNoteLinks;
  write(data);
  res.json(data.preferences);
});

module.exports = router;
