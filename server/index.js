require('dotenv').config();
const express = require('express');
const path = require('path');

const projectsRouter = require('./routes/projects');
const notesRouter = require('./routes/notes');
const preferencesRouter = require('./routes/preferences');
const quickLinksRouter = require('./routes/quickLinks');
const clustersRouter = require('./routes/clusters');

const app = express();
const PORT = process.env.PORT || 6002;

app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/quick-links', quickLinksRouter);
app.use('/api/clusters', clustersRouter);

// Serve built Vue app in production
const CLIENT_DIST = path.join(__dirname, '../client/dist');
app.use(express.static(CLIENT_DIST));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Evergreen Fastball running on http://localhost:${PORT}`);
  if (!process.env.OBSIDIAN_VAULT) {
    console.warn('Warning: OBSIDIAN_VAULT is not set. Note operations will fail until it is configured.');
  }
});
