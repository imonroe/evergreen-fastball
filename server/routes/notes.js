const express = require('express');
const { read } = require('../lib/dataStore');
const { readNotes, addNote } = require('../lib/obsidian');

const router = express.Router();

// GET /api/notes/:projectId — notes for one project, newest first
router.get('/:projectId', (req, res) => {
  const { projects } = read();
  const project = projects.find((p) => p.id === req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  try {
    res.json(readNotes(project.filePath));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notes/:projectId — add a note
router.post('/:projectId', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'text is required' });

  const data = read();
  const project = data.projects.find((p) => p.id === req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  try {
    addNote(project.filePath, text.trim(), data.preferences.timezone, data.preferences.dailyNoteLinks);
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notes — journal: all notes from all projects, newest first
router.get('/', (_req, res) => {
  const data = read();
  try {
    const all = [];
    for (const project of data.projects) {
      const notes = readNotes(project.filePath);
      for (const note of notes) {
        all.push({ ...note, projectId: project.id, projectName: project.name, projectColor: project.color });
      }
    }
    all.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
