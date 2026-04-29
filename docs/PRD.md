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

## Architecture

| Component | Details |
|-----------|---------|
| Runtime | Local Docker container |
| Port | 6002 |
| Storage backend | Obsidian vault directory, mounted as a volume into the container |
| File paths | Relative to the configured vault root (e.g. `Projects/SOE.md`) |
| Data format | Plain markdown files (one file per project) |
| Note persistence | Append-only — new notes are appended to the project's markdown file with a timestamp |

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
- After a successful ADD, the input field is cleared and a brief confirmation is shown
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
- Each entry shows: project name, note text, date and time

**Behavior:**
- Notes are aggregated across all project files and sorted by timestamp, newest first
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

When a note is added, it is appended to the bottom of the project's Obsidian markdown file in this format:

```
- YYYY-MM-DD HH:MM — <note text>
```

This keeps the file human-readable in Obsidian and parseable by the app.

---

## Configuration

- Obsidian vault root path is set via an environment variable or config file at container startup
- Port (default 6002) is configurable via environment variable

## Preferences

User-configurable settings stored in the app (not requiring a container restart):

| Preference | Default | Description |
|------------|---------|-------------|
| Enter-to-add | On | Whether pressing Enter in a note input field submits the note (same as clicking ADD) |

---

## Functional Requirements

| ID | Requirement |
|----|-------------|
| F-01 | The app shall display a list of all tracked projects on the home page |
| F-02 | Each project row shall include a text input, ADD button, LIST button, and Edit button |
| F-03 | Clicking ADD shall append the note with a timestamp to the project's Obsidian file |
| F-04 | Clicking LIST shall show all notes for that project, newest first |
| F-05 | The Journal view shall show all notes from all projects, newest first |
| F-06 | Each journal entry shall display the source project name |
| F-07 | The app shall support adding new projects with a name and vault-relative Obsidian file path |
| F-08 | The app shall support editing and deleting projects without modifying Obsidian files |
| F-09 | The Obsidian vault root path shall be configurable without rebuilding the container |
| F-10 | The app shall run entirely locally with no external network dependencies |
| F-11 | Projects shall be reorderable via drag-and-drop; order shall persist across page loads |
| F-12 | If a project's Obsidian file does not exist when a note is added, the app shall create it (including parent directories) |
| F-13 | Pressing Enter in a note input shall trigger ADD when the "Enter-to-add" preference is enabled |
| F-14 | The "Enter-to-add" preference shall be toggleable from within the app and shall default to On |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| N-01 | The app shall be served on port 6002 by default |
| N-02 | Page loads and note submissions shall feel instantaneous (< 200ms on localhost) |
| N-03 | The app shall handle an arbitrary number of projects without degraded UX |
| N-04 | Note writes shall be atomic enough to avoid corrupting Obsidian files on concurrent use |

---

