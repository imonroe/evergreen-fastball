# Product Requirements Document: Evergreen Fastball

## Overview

Evergreen Fastball is a locally-hosted web application for capturing quick notes across multiple concurrent projects. It uses an Obsidian vault as its backend storage, so notes live in plain markdown files alongside the user's existing Obsidian knowledge base.

---

## Problem Statement

The user works across several projects simultaneously and receives requests from multiple stakeholders. Quick-capture notes end up buried in a daily Obsidian note and rarely get moved to the correct project page. The friction of switching between apps and manually filing notes causes information to fall through the cracks.

---

## Goals

- Provide a single, always-accessible local web page for quick note capture
- Route each note to the correct project's Obsidian page automatically
- Make it easy to review all notes for a given project, or all notes across all projects
- Keep Obsidian as the source of truth — no separate database

---

## Non-Goals

- Cloud hosting or sync
- Rich text / markdown editing (plain text notes only)
- Two-way sync or parsing existing Obsidian content (append-only)
- Mobile app
- Multi-user support

---

## Users

Single user (the developer/operator running the local container).

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Backend | Node.js with Express |
| Frontend | Vue.js |
| App state | JSON file (project registry, ordering, preferences) |
| Note storage | Plain markdown files in the Obsidian vault |

---

## Architecture

| Component | Details |
|-----------|---------|
| Runtime | Local Docker container |
| Port | 6002 |
| Storage backend | Obsidian vault directory, mounted as a volume into the container |
| File paths | Relative to the configured vault root (e.g. `Projects/SOE.md`) |
| Data format | Plain markdown files (one file per project) |
| Note persistence | Append-only — notes are written under a `## Notes` heading in each project file |
| App state | `data.json` file (persists project list, order, and preferences) |

---

## Views

### 1. Projects View (default / home)

The main dashboard. Lists all tracked projects.

**Layout:**
- Left sidebar with navigation links: **Projects**, **Journal**
- Main content area: one row per project

**Per-project row contains:**
- Project name label
- **Edit** button — opens project edit form (rename, change linked Obsidian file, delete project)
- Quick-note text input field
- **ADD** button — appends the note to the project's Obsidian file and clears the input
- **LIST** button — navigates to the Project Notes view for that project

**Behavior:**
- Pressing ADD (or Enter, see Preferences) with an empty input does nothing
- After a successful ADD, the input field is cleared and a toast notification briefly appears confirming the note was saved
- Projects are displayed in user-defined order; rows can be dragged to reorder

---

### 2. Project Notes View

Lists all notes for a single project, newest first.

**Layout:**
- Back navigation to Projects View
- Project name as heading
- Chronological list of notes, newest at the top
- Each note shows: note text, date and time it was added

**Behavior:**
- Notes are read directly from the project's Obsidian markdown file
- No editing or deletion of individual notes in this view (Obsidian is the place to do that)

---

### 3. Journal View

Lists all notes from all projects combined, newest first.

**Layout:**
- Accessible from the sidebar "Journal" link
- Each entry shows: project name badge (color auto-assigned from a fixed palette), note text, date and time

**Behavior:**
- Notes are aggregated across all project files and sorted by timestamp, newest first
- Notes captured through the Daily Note quick-note form are also included, shown with a "Daily Note" badge
- Project badge colors are assigned automatically from a fixed palette when a project is created; the same color is used consistently across the Journal view
- Read-only

---

## Project Management

- Projects can be added from the Projects View (e.g., an "Add Project" button or form)
- Each project requires:
  - A display name
  - A path to (or name of) its corresponding Obsidian markdown file
- Projects can be renamed or deleted via the Edit button on each row
- Projects can be reordered by dragging rows on the dashboard; order is persisted
- Deleting a project removes it from the app's tracking list but does **not** delete the underlying Obsidian file
- If the linked Obsidian file does not exist when a note is first added, the app creates it automatically (including any intermediate directories relative to the vault root)

---

## Note Storage Format

Each project's Obsidian markdown file contains a `## Notes` section. The app only reads from and writes to content within that section; any other content in the file (headings, existing text, etc.) is left untouched.

When a note is added, a new line is written inside the `## Notes` section in this format:

```
- YYYY-MM-DD HH:MM — <note text>
```

Timestamps use the timezone configured in the user's preferences (see Preferences). If no timezone is set, the container's local time is used.

**Insertion position:** New notes are inserted immediately before the next heading after `## Notes` (if one exists), or at the end of the file if `## Notes` is the last section. This ensures notes accumulate in reverse-chronological order within the section as viewed in Obsidian.

**File creation:** If the file does not yet contain a `## Notes` heading, the app appends one before writing the first note. If the file does not exist at all, it is created automatically (including any intermediate directories).

**Note line format:** Depends on the Daily Note links preference:
- Links off: `- YYYY-MM-DD HH:MM — <text>`
- Links on:  `- [[YYYY-MM-DD]] HH:MM — <text>`

**Parsing:** Both formats are accepted when reading. Lines that match neither are silently skipped.

---

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OBSIDIAN_VAULT` | Yes | — | Absolute path to the Obsidian vault root inside the container (mount your vault here) |
| `PORT` | No | `6002` | Port the Express server listens on |
| `DATA_FILE` | No | `./data.json` | Path to the JSON file storing the project registry and preferences |

## Preferences

User-configurable settings stored in the app (not requiring a container restart):

| Preference | Default | Description |
|------------|---------|-------------|
| Enter-to-add | On | Whether pressing Enter in a note input field submits the note (same as clicking ADD) |
| Timezone | *(container local)* | IANA timezone name (e.g. `America/Los_Angeles`) used when writing timestamps to Obsidian files. Displayed and editable in the Settings view. |
| Daily Note links | Off | When on, dates are written as `[[YYYY-MM-DD]]` instead of plain `YYYY-MM-DD`, creating a link to the Obsidian Daily Note for that day. Both formats are accepted when reading notes. |

---

## Functional Requirements

| ID | Requirement |
|----|-------------|
| F-01 | The app shall display a list of all tracked projects on the home page |
| F-02 | Each project row shall include a text input, ADD button, LIST button, and Edit button |
| F-03 | Clicking ADD shall append the note with a timestamp to the project's Obsidian file |
| F-04 | Clicking LIST shall show all notes for that project, newest first |
| F-05 | The Journal view shall show all notes from all projects, plus notes captured via the Daily Note form, newest first |
| F-06 | Each journal entry shall display the source project name (Daily Note captures shall display a "Daily Note" badge) |
| F-07 | The app shall support adding new projects with a name and vault-relative Obsidian file path |
| F-08 | The app shall support editing and deleting projects without modifying Obsidian files |
| F-09 | The Obsidian vault root path shall be configurable without rebuilding the container |
| F-10 | The app shall run entirely locally with no external network dependencies |
| F-11 | Projects shall be reorderable via drag-and-drop; order shall persist across page loads |
| F-12 | If a project's Obsidian file does not exist when a note is added, the app shall create it (including parent directories) |
| F-13 | Pressing Enter in a note input shall trigger ADD when the "Enter-to-add" preference is enabled |
| F-14 | The "Enter-to-add" preference shall be toggleable from within the app and shall default to On |
| F-15 | A successful ADD shall display a toast notification confirming the note was saved |
| F-16 | Each project shall be auto-assigned a badge color from a fixed palette; the color shall be used consistently in the Journal view |
| F-17 | The user shall be able to set a timezone preference (IANA name) in Settings; all Obsidian timestamps shall use that timezone |
| F-18 | Lines in a `## Notes` section that do not match the app's timestamp format shall be silently skipped when parsing |
| F-19 | New notes shall be inserted immediately before the next heading after `## Notes`, or at end-of-file if none exists |
| F-20 | When "Daily Note links" is on, dates shall be written as `[[YYYY-MM-DD]]`; the app shall parse both linked and plain formats when reading |
| F-21 | The "Daily Note links" preference shall be toggleable in Settings and shall default to Off |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| N-01 | The app shall be served on port 6002 by default |
| N-02 | Page loads and note submissions shall feel instantaneous (< 200ms on localhost) |
| N-03 | The app shall handle an arbitrary number of projects without degraded UX |
| N-04 | Note writes shall be atomic enough to avoid corrupting Obsidian files on concurrent use |

---

