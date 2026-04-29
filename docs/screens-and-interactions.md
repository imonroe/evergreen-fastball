# Screens and Interactions

## Screens

### 1. Projects View (Home)
The default landing page. Shows all tracked projects and allows quick note capture.

**Elements:**
- Left sidebar: app logo/name, "Projects" nav link (active), "Journal" nav link, "Settings" nav link
- "Add Project" button
- Project list — one row per project, in user-defined order
- Each project row:
  - Drag handle (for reordering)
  - Project name
  - Quick-note text input (placeholder: "Quick note…")
  - ADD button
  - LIST button
  - Edit (pencil) icon button

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
All notes from all projects combined, newest first.

**Elements:**
- Left sidebar (same as Projects View; "Journal" active)
- Page heading: "Journal"
- Read-only list of notes, newest first
  - Each entry: project name badge/tag, timestamp, note text

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
- **Enter-to-add** toggle (on/off) — label: "Press Enter to add a note"
- Vault path display (read-only, shows the `OBSIDIAN_VAULT` env var value for reference)

---

## Interactions

### Note Capture
| Trigger | Action |
|---------|--------|
| Type in note input + click ADD | Appends note to project's Obsidian file; clears input; shows brief "Added!" confirmation |
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

### Project Management
| Trigger | Action |
|---------|--------|
| Click "Add Project" | Open Add Project modal |
| Submit Add Project form | Create project entry in data.json; add row to Projects View; close modal |
| Click Edit icon on project row | Open Edit Project modal pre-filled with project data |
| Submit Edit Project form | Update project entry in data.json; update row in Projects View; close modal |
| Click "Delete Project" in Edit modal | Show inline confirmation |
| Confirm delete | Remove project from data.json; remove row from Projects View; close modal |

### Reordering
| Trigger | Action |
|---------|--------|
| Drag project row by its handle | Reorder projects in the list |
| Drop in new position | Persist new order to data.json |
