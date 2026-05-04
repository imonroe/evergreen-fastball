const express = require('express');
const { read, write } = require('../lib/dataStore');

const router = express.Router();

router.get('/', (_req, res) => {
  const data = read();
  res.json(data.clusters || []);
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const data = read();
  if (!data.clusters) data.clusters = [];
  const cluster = {
    id: crypto.randomUUID(),
    name: name.trim(),
    collapsed: false,
  };
  data.clusters.push(cluster);
  write(data);
  res.status(201).json(cluster);
});

router.put('/:id', (req, res) => {
  const data = read();
  if (!data.clusters) data.clusters = [];
  const idx = data.clusters.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Cluster not found' });

  const { name, collapsed } = req.body;
  if (name !== undefined) data.clusters[idx].name = name.trim();
  if (collapsed !== undefined) data.clusters[idx].collapsed = Boolean(collapsed);
  write(data);
  res.json(data.clusters[idx]);
});

router.delete('/:id', (req, res) => {
  const data = read();
  if (!data.clusters) data.clusters = [];
  const idx = data.clusters.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Cluster not found' });

  // Unassign all projects that belonged to this cluster
  const clusterId = req.params.id;
  if (data.projects) {
    data.projects.forEach((p) => {
      if (p.clusterId === clusterId) p.clusterId = null;
    });
  }

  data.clusters.splice(idx, 1);
  write(data);
  res.status(204).end();
});

module.exports = router;
