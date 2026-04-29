# Evergreen Fastball

A locally-hosted web app for capturing quick notes across multiple concurrent projects, using an Obsidian vault as the backend storage.

## Architecture

- **Backend:** Node.js + Express (`server/`)
- **Frontend:** Vue 3 + Vite (`client/`)
- **App state:** `data.json` — project registry, ordering, preferences
- **Note storage:** Plain markdown files in the user's Obsidian vault
- **Port:** 6002 (default)

## Running locally

```bash
# Copy and fill in the required env var
cp example.env .env   # set OBSIDIAN_VAULT=/path/to/vault

# Install
npm install
cd client && npm install && cd ..

# Build client once (or use dev mode below)
npm run build:client

# Start server
npm start             # serves built Vue + API on :6002
```

**Dev mode (hot reload):**
```bash
npm run dev           # Terminal 1: Express on :6002
cd client && npm run dev   # Terminal 2: Vite on :5173, proxies /api to :6002
```

## Key files

| Path | Purpose |
|------|---------|
| `server/index.js` | Express entry point; loads `.env` via dotenv |
| `server/lib/dataStore.js` | Read/write `data.json`; assigns badge colors to new projects |
| `server/lib/obsidian.js` | Parse `## Notes` section; append notes; create files if missing |
| `server/routes/projects.js` | CRUD + reorder endpoint |
| `server/routes/notes.js` | Add note, get project notes, journal aggregation |
| `server/routes/preferences.js` | Get/put preferences + vault-path display endpoint |
| `client/src/api.js` | Thin fetch wrappers for every API endpoint |
| `client/src/composables/useToast.js` | Singleton toast (module-level refs, 2.5s auto-hide) |
| `client/src/router/index.js` | Routes: `/`, `/projects/:id/notes`, `/journal`, `/settings` |

## Environment variables

Loaded from `.env` in the project root (see `example.env`).

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OBSIDIAN_VAULT` | Yes | — | Absolute path to the vault root inside the container |
| `PORT` | No | `6002` | Express listen port |
| `DATA_FILE` | No | `./data.json` | Path to the project registry file |

## Note storage format

Notes live in a `## Notes` section in each project's `.md` file:

```
- YYYY-MM-DD HH:MM — note text here
```

- The timestamp timezone is the user's preference stored in `data.json` (falls back to container local time).
- New notes are inserted before the next heading after `## Notes` (chronological order in file; reversed for display).
- Lines that don't match the format are silently skipped when reading.
- The file and any missing parent directories are created automatically on first write.

## Docker

```bash
docker compose up --build
```

Edit `docker-compose.yml` to set the vault volume path before running.

## Design

Designs should be done in advance and approved before any front-end change is made. Use the Pencil MCP to work with the `.pen` files in `designs/`. The canonical design file is `designs/Screen Designs.pen`.

See `docs/` for the full PRD, screens-and-interactions spec, and design decisions.

## Additional information

- Use the Pencil MCP to work with the designs in the `designs/` directory.
