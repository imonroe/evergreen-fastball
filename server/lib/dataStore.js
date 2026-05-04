const fs = require('fs');
const path = require('path');

const DATA_FILE = process.env.DATA_FILE
  ? path.resolve(process.env.DATA_FILE)
  : path.join(__dirname, '../../data.json');

const BADGE_COLORS = [
  { bg: '#DCFCE7', text: '#15803D' },
  { bg: '#DBEAFE', text: '#1D4ED8' },
  { bg: '#FEF9C3', text: '#A16207' },
  { bg: '#FCE7F3', text: '#BE185D' },
  { bg: '#F3E8FF', text: '#7C3AED' },
  { bg: '#FFEDD5', text: '#C2410C' },
  { bg: '#CFFAFE', text: '#0E7490' },
  { bg: '#FEE2E2', text: '#B91C1C' },
];

const DEFAULT_DATA = {
  projects: [],
  clusters: [],
  quickLinks: [],
  preferences: { enterToAdd: true, timezone: '', dailyNoteLinks: false },
};

function read() {
  if (!fs.existsSync(DATA_FILE)) return JSON.parse(JSON.stringify(DEFAULT_DATA));
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function write(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function nextColor(projects) {
  return BADGE_COLORS[projects.length % BADGE_COLORS.length];
}

module.exports = { read, write, nextColor };
