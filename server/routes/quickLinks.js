const express = require('express');
const { read, write } = require('../lib/dataStore');

const router = express.Router();

router.get('/', (_req, res) => {
  const data = read();
  res.json(data.quickLinks || []);
});

router.post('/', (req, res) => {
  const { label, url } = req.body;
  if (!label || !url) return res.status(400).json({ error: 'label and url are required' });

  const data = read();
  if (!data.quickLinks) data.quickLinks = [];
  const link = {
    id: crypto.randomUUID(),
    label: label.trim(),
    url: url.trim(),
  };
  data.quickLinks.push(link);
  write(data);
  res.status(201).json(link);
});

router.put('/:id', (req, res) => {
  const data = read();
  if (!data.quickLinks) data.quickLinks = [];
  const idx = data.quickLinks.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Quick link not found' });

  const { label, url } = req.body;
  if (label !== undefined) data.quickLinks[idx].label = label.trim();
  if (url !== undefined) data.quickLinks[idx].url = url.trim();
  write(data);
  res.json(data.quickLinks[idx]);
});

router.delete('/:id', (req, res) => {
  const data = read();
  if (!data.quickLinks) data.quickLinks = [];
  const idx = data.quickLinks.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Quick link not found' });
  data.quickLinks.splice(idx, 1);
  write(data);
  res.status(204).end();
});

module.exports = router;
