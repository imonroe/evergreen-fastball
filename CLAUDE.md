# Evergreen Fastball

A local web app for capturing quick notes across multiple projects, backed by Obsidian markdown files.

## Problem

The user manages several concurrent projects and gets requests from multiple people. Notes tend to pile up in a daily Obsidian note and never get filed into the right project pages.

## Architecture

- **Local Docker container** serving a web UI on **port 6002**
- **Obsidian vault** as the backend (plain markdown files on disk, mounted into the container)
- No database — Obsidian notes are the source of truth
- Each project maps to one Obsidian markdown file; notes are appended with a date/timestamp

## Features

- **Projects view** — lists all tracked projects; each row has a quick-note input, an ADD button, and a LIST button
- **Project list view** — all notes for a single project, newest first
- **Journal view** — all notes from all projects combined, newest first
- Projects are manageable (add/edit/remove) via an Edit button per project

## Key Constraints

- Must run entirely locally (no cloud services)
- Obsidian vault path must be configurable (mounted volume)
- Notes are appended to the corresponding Obsidian page file with a timestamp; the app never rewrites existing note content
- Support an arbitrary number of projects

## Additional information

- Use the Pencil MCP to work with the designs in the `designs/` directory.