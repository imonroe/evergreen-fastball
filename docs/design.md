# Design notes

## Process

Designs are created before any front-end implementation. Changes to the UI should be reflected in the Pencil designs first and reviewed before coding begins.

Use the Pencil MCP to read and write `.pen` files. Do not open them with standard file tools — the format is encrypted and only accessible via the Pencil MCP tools.

## Design files

| File | Contents |
|------|----------|
| `designs/Screen Designs.pen` | All six application screens |

## Screens

| # | Screen | Route |
|---|--------|-------|
| 1 | Projects View (home) | `/` |
| 2 | Project Notes View | `/projects/:id/notes` |
| 3 | Journal View | `/journal` |
| 4 | Add Project Modal | overlay on `/` |
| 5 | Edit Project Modal | overlay on `/` |
| 6 | Settings View | `/settings` |

## Visual language

| Token | Value |
|-------|-------|
| Sidebar background | `#1E293B` |
| Primary accent | `#10B981` (emerald) |
| Page background | `#F1F5F9` |
| Card background | `#FFFFFF` |
| Primary text | `#0F172A` |
| Secondary text | `#64748B` |
| Border | `#E2E8F0` |
| Danger | `#EF4444` |
| Font | Inter |

Project badge colors are auto-assigned from an 8-color palette cycling through green, blue, yellow, pink, purple, orange, cyan, and red.

## References

- Full screen element list and interaction table: `docs/screens-and-interactions.md`
- Feature requirements that drove design decisions: `docs/PRD.md`
