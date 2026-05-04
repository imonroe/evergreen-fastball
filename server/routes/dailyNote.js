const express = require('express');
const { read } = require('../lib/dataStore');
const { addNote } = require('../lib/obsidian');

const router = express.Router();

function computePath(pattern, timezone) {
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '00';
  const resolved = pattern
    .replace(/YYYY/g, get('year'))
    .replace(/MM/g, get('month'))
    .replace(/DD/g, get('day'));
  return resolved.endsWith('.md') ? resolved : resolved + '.md';
}

router.post('/', (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'text is required' });

  const data = read();
  const prefs = data.preferences;
  if (!prefs.dailyNoteEnabled) return res.status(400).json({ error: 'Daily note quick-note is disabled' });

  const pattern = prefs.dailyNotePattern || 'Daily Notes/YYYY/MM/YYYY-MM-DD';
  const filePath = computePath(pattern, prefs.timezone);

  try {
    addNote(filePath, text.trim(), prefs.timezone, prefs.dailyNoteLinks);
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
