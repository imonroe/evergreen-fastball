const express = require('express');
const { read } = require('../lib/dataStore');
const { readNotes, readDailyNotes, addNote } = require('../lib/obsidian');

const router = express.Router();

// Synthetic project identity for notes captured into the Obsidian daily note.
const DAILY_NOTE_ID = '__daily-note__';
const DAILY_NOTE_NAME = 'Daily Note';
const DAILY_NOTE_COLOR = { bg: '#E2E8F0', text: '#475569' };
const DEFAULT_DAILY_NOTE_PATTERN = 'Daily Notes/YYYY/MM/YYYY-MM-DD';

// GET /api/notes/cluster/:clusterId — all notes from projects in a cluster, newest first
router.get('/cluster/:clusterId', (req, res) => {
  const data = read();
  const clusterProjects = (data.projects || []).filter((p) => p.clusterId === req.params.clusterId);
  try {
    const all = [];
    for (const project of clusterProjects) {
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

    // Include notes captured through the Daily Note quick-note form. These live
    // in dated daily-note files rather than a project, so aggregate them here.
    const pattern = data.preferences?.dailyNotePattern || DEFAULT_DAILY_NOTE_PATTERN;
    for (const note of readDailyNotes(pattern)) {
      all.push({ ...note, projectId: DAILY_NOTE_ID, projectName: DAILY_NOTE_NAME, projectColor: DAILY_NOTE_COLOR });
    }

    all.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
