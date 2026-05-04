const express = require('express');
const { read, write, nextColor } = require('../lib/dataStore');

const router = express.Router();

router.get('/', (_req, res) => {
  const { projects } = read();
  res.json(projects);
});

router.post('/', (req, res) => {
  const { name, filePath } = req.body;
  if (!name || !filePath) return res.status(400).json({ error: 'name and filePath are required' });
  if (!filePath.endsWith('.md')) return res.status(400).json({ error: 'filePath must end in .md' });

  const data = read();
  const project = {
    id: crypto.randomUUID(),
    name: name.trim(),
    filePath: filePath.trim(),
    color: nextColor(data.projects),
    createdAt: new Date().toISOString(),
  };
  data.projects.push(project);
  write(data);
  res.status(201).json(project);
});

router.put('/reorder', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' });

  const data = read();
  const byId = Object.fromEntries(data.projects.map((p) => [p.id, p]));
  const reordered = ids.map((id) => byId[id]).filter(Boolean);
  // preserve any projects not in the ids list at the end
  const inList = new Set(ids);
  data.projects.filter((p) => !inList.has(p.id)).forEach((p) => reordered.push(p));
  data.projects = reordered;
  write(data);
  res.json(data.projects);
});

router.put('/:id', (req, res) => {
  const { name, filePath } = req.body;
  const data = read();
  const idx = data.projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  if (filePath && !filePath.endsWith('.md')) return res.status(400).json({ error: 'filePath must end in .md' });

  if (name) data.projects[idx].name = name.trim();
  if (filePath) data.projects[idx].filePath = filePath.trim();
  if ('clusterId' in req.body) data.projects[idx].clusterId = req.body.clusterId ?? null;
  write(data);
  res.json(data.projects[idx]);
});

router.delete('/:id', (req, res) => {
  const data = read();
  const idx = data.projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  data.projects.splice(idx, 1);
  write(data);
  res.status(204).end();
});

module.exports = router;
