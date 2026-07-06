# Screens and Interactions

## Screens

### 1. Projects View (Home)
The default landing page. Shows all tracked projects and allows quick note capture.

**Elements:**
- Left sidebar: app logo/name, "Projects" nav link (active), "Journal" nav link, "Settings" nav link, Quick Links section (see below)
- "Add Project" button and "Add Cluster" button in the header
- Project list — cluster header rows (for grouped projects) and ungrouped project rows, in user-defined order
- Each cluster header row:
  - Chevron icon (expand ▾ / collapse ▸)
  - Cluster name
  - Edit (pencil) icon button
- Each project row:
  - Drag handle (for reordering)
  - Project name
  - Quick-note text input (placeholder: "Quick note…")
  - ADD button
  - LIST button
  - Edit (pencil) icon button
- Projects not assigned to any cluster appear below all cluster sections as a flat list

**Empty state:** If no projects exist, a centered prompt to add the first project.

---

### 2. Project Notes View
All notes for a single project, newest first.

**Elements:**
- Back link ("← Projects")
- Project name as page heading
- Read-only list of notes, newest first
  - Each entry: timestamp (YYYY-MM-DD HH:MM) + note text

**Empty state:** "No notes yet for this project."

---

### 3. Journal View
All notes from all projects combined — plus notes captured through the Daily Note quick-note form — newest first.

**Elements:**
- Left sidebar (same as Projects View; "Journal" active)
- Page heading: "Journal"
- Read-only list of notes, newest first
  - Each entry: project name badge (auto-assigned color), timestamp, note text
  - Daily Note captures appear with a "Daily Note" badge

**Empty state:** "No notes yet. Add a note from the Projects page."

---

### 4. Add Project Modal
Triggered by clicking "Add Project" on the Projects View.

**Elements:**
- Modal overlay
- Heading: "Add Project"
- Input: Project display name (required)
- Input: Vault-relative file path (e.g. `Projects/SOE.md`) (required)
- Cancel button
- Save button

**Validation:**
- Both fields required
- File path must end in `.md`

---

### 5. Edit Project Modal
Triggered by clicking the Edit icon on a project row.

**Elements:**
- Modal overlay
- Heading: "Edit Project"
- Input: Project display name (pre-filled)
- Input: Vault-relative file path (pre-filled)
- Cancel button
- Save button
- Delete Project button (destructive, separated visually)

**Delete confirmation:** Clicking "Delete Project" shows an inline confirmation ("Are you sure? This will not delete the Obsidian file.") with Confirm and Cancel options.

---

### 6. Settings View
Accessible from the sidebar "Settings" link.

**Elements:**
- Left sidebar (same as other views; "Settings" active)
- Page heading: "Settings"
- **Note Capture** section:
  - **Enter-to-add** toggle (on/off) — label: "Press Enter to add a note"
  - **Daily Note links** toggle (on/off) — label: "Link timestamps to Daily Notes"
  - **Timezone** text input — IANA timezone name; used for all Obsidian timestamps
- **Quick Links** section:
  - List of saved links; each row shows: link label (bold), URL, edit icon, delete icon
  - "Add Link" button below the list
  - Empty state: "No quick links yet."
- **Vault** section:
  - Vault Root Path display (read-only, shows the `OBSIDIAN_VAULT` env var value)

---

### 7. Add Quick Link Modal
Triggered by clicking "Add Link" in the Settings Quick Links section.

**Elements:**
- Modal overlay
- Heading: "Add Quick Link"
- Input: Link label (required)
- Input: URL (required, e.g. `https://example.com`)
- Cancel button
- Save button

**Validation:**
- Both fields required
- URL must start with `http://` or `https://`

---

### 8. Edit Quick Link Modal
Triggered by clicking the Edit icon on a Quick Link row in Settings.

**Elements:**
- Modal overlay
- Heading: "Edit Quick Link"
- Input: Link label (pre-filled)
- Input: URL (pre-filled)
- Cancel button
- Save button
- Delete Link button (destructive, separated visually)

**Delete confirmation:** Clicking "Delete Link" shows an inline confirmation with Confirm and Cancel options.

---

### 9. Add Cluster Modal
Triggered by clicking "Add Cluster" on the Projects View.

**Elements:**
- Modal overlay
- Heading: "Add Cluster"
- Input: Cluster name (required)
- Cancel button
- Save button

---

### 10. Edit Cluster Modal
Triggered by clicking the Edit icon on a cluster header row.

**Elements:**
- Modal overlay
- Heading: "Edit Cluster"
- Input: Cluster name (pre-filled)
- Cancel button
- Save button
- Delete Cluster button (destructive, separated visually)

**Delete confirmation:** Clicking "Delete Cluster" shows an inline confirmation ("Are you sure? Projects in this cluster will become unclustered.") with Confirm and Cancel options.

---

## Interactions

### Note Capture
| Trigger | Action |
|---------|--------|
| Type in note input + click ADD | Appends note to project's Obsidian file; clears input; shows toast notification "Note saved" |
| Type in note input + press Enter (if Enter-to-add is On) | Same as above |
| Click ADD with empty input | No-op |
| Press Enter with empty input | No-op |

### Navigation
| Trigger | Action |
|---------|--------|
| Click "Projects" in sidebar | Navigate to Projects View |
| Click "Journal" in sidebar | Navigate to Journal View |
| Click "Settings" in sidebar | Navigate to Settings View |
| Click LIST on a project row | Navigate to Project Notes View for that project |
| Click "← Projects" in Project Notes View | Navigate back to Projects View |
| Click a Quick Link in the sidebar | Open the link's URL in a new browser tab |

### Project Management
| Trigger | Action |
|---------|--------|
| Click "Add Project" | Open Add Project modal |
| Submit Add Project form | Create project entry in data.json; add row to Projects View; close modal |
| Click Edit icon on project row | Open Edit Project modal pre-filled with project data |
| Submit Edit Project form | Update project entry in data.json; update row in Projects View; close modal |
| Click "Delete Project" in Edit modal | Show inline confirmation |
| Confirm delete | Remove project from data.json; remove row from Projects View; close modal |

### Cluster Management
| Trigger | Action |
|---------|--------|
| Click "Add Cluster" | Open Add Cluster modal |
| Submit Add Cluster form | Create cluster entry in data.json; add cluster header to Projects View; close modal |
| Click chevron on cluster header | Toggle expand/collapse for that cluster; persist state |
| Click Edit icon on cluster header | Open Edit Cluster modal pre-filled with cluster name |
| Submit Edit Cluster form | Update cluster name in data.json; update header; close modal |
| Click "Delete Cluster" in Edit modal | Show inline confirmation ("Projects will become unclustered") |
| Confirm delete cluster | Remove cluster from data.json; move member projects to unclustered; close modal |
| Drag a project row into a cluster | Assign project to that cluster; persist to data.json |
| Drag a project row out of a cluster | Remove project's cluster assignment; project appears in unclustered section |

### Quick Links Management (Settings)
| Trigger | Action |
|---------|--------|
| Click "Add Link" | Open Add Quick Link modal |
| Submit Add Quick Link form | Create link in data.json; add row to Quick Links list in Settings; close modal |
| Click Edit icon on a link row | Open Edit Quick Link modal pre-filled with link data |
| Submit Edit Quick Link form | Update link in data.json; update row in list; close modal |
| Click "Delete Link" in Edit modal | Show inline confirmation |
| Confirm delete link | Remove link from data.json; remove row from list; close modal |

### Reordering
| Trigger | Action |
|---------|--------|
| Drag project row by its handle | Reorder project within its section (cluster or unclustered) |
| Drop in new position | Persist new order to data.json |
