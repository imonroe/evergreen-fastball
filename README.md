# Evergreen Fastball

A locally-hosted web app for capturing quick notes across multiple concurrent projects, backed by your Obsidian vault as storage.

## The problem

Working across several projects means notes end up buried in daily Obsidian entries and never get filed to the right place. Evergreen Fastball gives you a single always-open tab where you can drop a note against any project in one keystroke — it gets timestamped and appended to that project's Obsidian markdown file automatically.

## Features

- **Projects dashboard** — one row per project with a quick-note input, ADD and LIST buttons, and drag-to-reorder
- **Project notes view** — all notes for a project, newest first
- **Journal view** — all notes from all projects combined, newest first, with per-project color badges
- **Settings** — toggle Enter-to-add, set your local timezone for timestamps, view vault path
- Obsidian is the source of truth — notes are appended under a `## Notes` heading in each project's `.md` file; no separate database

## Tech stack

| Layer | Choice |
|-------|--------|
| Backend | Node.js + Express |
| Frontend | Vue 3 + Vue Router |
| Drag-and-drop | vuedraggable (SortableJS) |
| Build tool | Vite |
| App state | `data.json` (project list, order, preferences) |
| Note storage | Plain `.md` files in your Obsidian vault |

---

## Getting started

### Prerequisites

- Node.js 18+
- An Obsidian vault on your local machine

### 1. Clone and install

```bash
git clone <repo-url>
cd evergreen-fastball

npm install
cd client && npm install && cd ..
```

### 2. Configure environment

```bash
cp example.env .env
```

Edit `.env` and set `OBSIDIAN_VAULT` to the absolute path of your vault:

```env
OBSIDIAN_VAULT=/home/ian/Documents/MyVault
```

### 3. Build the client

```bash
npm run build:client
```

### 4. Run

```bash
npm start
```

Open [http://localhost:6002](http://localhost:6002).

---

## Development workflow

Run the server and the Vite dev server concurrently. Vite proxies `/api` requests to the Express server.

```bash
# Terminal 1 — Express API server
npm run dev

# Terminal 2 — Vite dev server with hot reload
cd client && npm run dev
```

The Vue app is available at [http://localhost:5173](http://localhost:5173) in dev mode.

---

## Docker

### Build and run

```bash
docker compose up --build
```

### Configure `docker-compose.yml`

Before running, edit `docker-compose.yml` and replace the vault volume path:

```yaml
volumes:
  - /path/to/your/obsidian/vault:/vault   # ← replace this
  - ./data.json:/app/data.json
```

The container serves the app on port **6002**.

---

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OBSIDIAN_VAULT` | Yes | — | Absolute path to your Obsidian vault root |
| `PORT` | No | `6002` | Port the server listens on |
| `DATA_FILE` | No | `./data.json` | Path to the JSON file for project registry and preferences |

Variables are loaded from a `.env` file in the project root (copy from `example.env`). In Docker, set them via `docker-compose.yml`.

---

## Project structure

```
evergreen-fastball/
├── server/
│   ├── index.js              Express server entry point
│   ├── lib/
│   │   ├── dataStore.js      Read/write data.json
│   │   └── obsidian.js       Parse and write Obsidian markdown files
│   └── routes/
│       ├── projects.js       CRUD + reorder
│       ├── notes.js          Add note, get project notes, journal feed
│       └── preferences.js    Get/update preferences
├── client/
│   ├── src/
│   │   ├── App.vue           Root shell (sidebar + toast)
│   │   ├── api.js            Fetch wrappers for all endpoints
│   │   ├── router/           Vue Router config
│   │   ├── composables/
│   │   │   └── useToast.js   Singleton toast state
│   │   ├── views/
│   │   │   ├── ProjectsView.vue
│   │   │   ├── ProjectNotesView.vue
│   │   │   ├── JournalView.vue
│   │   │   └── SettingsView.vue
│   │   └── components/
│   │       ├── AppSidebar.vue
│   │       ├── ProjectRow.vue
│   │       ├── AddProjectModal.vue
│   │       ├── EditProjectModal.vue
│   │       └── AppToast.vue
│   ├── index.html
│   ├── package.json
│   └── vite.config.js        Dev proxy: /api → localhost:6002
├── docs/                     PRD, screens spec, design notes
├── designs/                  Pencil design files
├── Dockerfile                Multi-stage: Vite build → Express image
├── docker-compose.yml
├── example.env
└── package.json
```

---

## API reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create a project |
| `PUT` | `/api/projects/:id` | Update name or file path |
| `DELETE` | `/api/projects/:id` | Remove a project (Obsidian file untouched) |
| `PUT` | `/api/projects/reorder` | Persist new drag-drop order |
| `GET` | `/api/notes` | Journal: all notes from all projects, newest first |
| `GET` | `/api/notes/:projectId` | Notes for one project, newest first |
| `POST` | `/api/notes/:projectId` | Append a note to the project's Obsidian file |
| `GET` | `/api/preferences` | Get user preferences |
| `PUT` | `/api/preferences` | Update preferences |
| `GET` | `/api/preferences/vault-path` | Read `OBSIDIAN_VAULT` for the Settings UI |

---

## How notes are stored

Each project maps to an Obsidian markdown file. Notes are appended under a `## Notes` heading:

```markdown
# My Project

## Notes
- 2026-04-29 14:32 — Call with Marcus, wants CSV export by Friday
- 2026-04-28 09:15 — Staging blocked on new DB instance

## References
...
```

- If the file does not exist it is created automatically (including parent directories).
- If no `## Notes` heading exists, one is appended.
- New notes are inserted just before the next heading after `## Notes`, so the section stays in chronological order.
- Lines that don't match the `- YYYY-MM-DD HH:MM — text` format are silently ignored when reading.
- All other content in the file is never touched.
