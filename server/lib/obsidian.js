const fs = require('fs');
const path = require('path');

// Matches both plain dates and Obsidian daily-note links:
//   - 2026-04-29 14:32 — text
//   - [[2026-04-29]] 14:32 — text
const NOTE_RE = /^- (?:\[\[)?(\d{4}-\d{2}-\d{2})(?:\]\])? (\d{2}:\d{2}) — (.+)$/;

function vaultRoot() {
  const root = process.env.OBSIDIAN_VAULT;
  if (!root) throw new Error('OBSIDIAN_VAULT environment variable is not set');
  return root;
}

function absPath(relPath) {
  return path.join(vaultRoot(), relPath);
}

function formatParts(timezone) {
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value ?? '00';
  // en-CA gives YYYY-MM-DD; hour can be '24' when midnight in some locales — clamp it
  const hour = get('hour') === '24' ? '00' : get('hour');
  return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${hour}:${get('minute')}` };
}

function readNotes(relPath) {
  const p = absPath(relPath);
  if (!fs.existsSync(p)) return [];

  const lines = fs.readFileSync(p, 'utf8').split('\n');

  const startIdx = lines.findIndex((l) => l.trim() === '## Notes');
  if (startIdx === -1) return [];

  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (/^#{1,6} /.test(lines[i])) { endIdx = i; break; }
  }

  const notes = [];
  for (let i = startIdx + 1; i < endIdx; i++) {
    const m = lines[i].match(NOTE_RE);
    if (m) notes.push({ timestamp: `${m[1]} ${m[2]}`, text: m[3] });
  }
  return notes.reverse();
}

function addNote(relPath, text, timezone, dailyNoteLinks = false) {
  const p = absPath(relPath);
  const { date, time } = formatParts(timezone);
  const dateStr = dailyNoteLinks ? `[[${date}]]` : date;
  const noteLine = `- ${dateStr} ${time} — ${text}`;

  fs.mkdirSync(path.dirname(p), { recursive: true });

  let content = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  let lines = content.split('\n');

  const notesIdx = lines.findIndex((l) => l.trim() === '## Notes');

  if (notesIdx === -1) {
    const separator = content.length > 0 && !content.endsWith('\n') ? '\n\n' : '';
    fs.writeFileSync(p, `${content}${separator}## Notes\n${noteLine}\n`, 'utf8');
    return;
  }

  // find next heading after ## Notes
  let insertIdx = lines.length;
  for (let i = notesIdx + 1; i < lines.length; i++) {
    if (/^#{1,6} /.test(lines[i])) { insertIdx = i; break; }
  }

  // step back over trailing blank lines to keep neat formatting
  while (insertIdx > notesIdx + 1 && lines[insertIdx - 1].trim() === '') {
    insertIdx--;
  }

  lines.splice(insertIdx, 0, noteLine);
  fs.writeFileSync(p, lines.join('\n'), 'utf8');
}

module.exports = { readNotes, addNote };
