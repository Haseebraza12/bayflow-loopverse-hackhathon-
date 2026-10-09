# BayFlow design system

BayFlow's product UI (POS, customer area, booking wizard, shop pages, auth) follows **IBM Carbon**'s
look and feel: Carbon's layering, grid, type scale, component anatomy, motion and focus. It keeps
BayFlow's own colours and fonts, and makes one deliberate change: **every button is a full pill**.

The marketing landing page (`app/(public)/page.tsx`, `PublicHeader`, `PublicFooter`) is **not** part
of this system. It opts out with the `.marketing` class, which restores the rounded 0.5rem radius.

Carbon is implemented by restyling the existing shadcn/Radix components in `components/ui/`, not by
installing `@carbon/react`. Build new screens from those components and the tokens below.

## Principles

1. **Flat and layered.** Depth comes from surface colour (canvas → layer → field), not shadows or
   borders. Only floating surfaces (menus, popovers, modals, sheets) cast a shadow.
2. **Square.** Corners are 0 (`--radius: 0`). Exceptions: buttons, tags, avatars and switches are
   pills; checkboxes have a 2px radius.
3. **Productive type.** Small, dense, sentence case. No all-caps labels, no weight above 600.
4. **Fast motion.** 70–240ms with Carbon's productive easing; nothing bounces.

## Tokens (`app/globals.css`)

### Layering (Carbon g10, built from the existing Open Color gray scale)

| Token | Utility | Value | Use |
|---|---|---|---|
| `--canvas` | `bg-canvas` | `#f1f3f5` | Page background behind tiles |
| `--layer` | `bg-layer` | `#ffffff` | Tiles, data tables, side nav, modals |
| `--layer-hover` | `bg-layer-hover` | `#f1f3f5` | Row / item hover on a layer |
| `--layer-accent` | `bg-layer-accent` | `#e9ecef` | Table header row, progress track |
| `--layer-selected` | `bg-layer-selected` | `#dee2e6` | Selected row, active side-nav item |
| `--field` | `bg-field` | `#f1f3f5` | Text inputs, selects, textareas |
| `--field-hover` | `bg-field-hover` | `#e9ecef` | Field hover |
| `--border-subtle` | `border-border-subtle` | `#dee2e6` | Dividers, row rules |
| `--border-strong` | `border-border-strong` | `#868e96` | Field bottom rule |
| `--text-helper` | `text-helper` | `#6c757d` | Helper text, placeholders, group labels |

Brand, status and CTA colours are unchanged (`--primary`, `--cta`, `--brand-*`, `--status-*`).

### Spacing

Carbon's 2px/8px scale maps to Tailwind steps: 2 `0.5` · 4 `1` · 8 `2` · 12 `3` · 16 `4` · 24 `6` ·
32 `8` · 40 `10` · 48 `12`. Page gutters are 16px on phones and 32px from `sm`; tiles pad 16px.

### Type (Archivo body, Pragati Narrow headings; Caveat only for the landing handwriting)

| Utility | Size / line | Use |
|---|---|---|
| `type-label-01` | 12 / 16, 0.32px | Field labels, tags, table meta |
| `type-helper-01` | 12 / 16, helper colour | Helper and caption text |
| `type-body-compact-01` | 14 / 18, 0.16px | Dense UI text, table cells |
| `type-body-01` | 14 / 20, 0.16px | Paragraphs |
| `type-heading-compact-01` | 14 / 18, 600 | Tile and section titles |
| `type-heading-compact-02` | 16 / 22, 600 | Card titles |
| `type-heading-03` | 20 / 28 | Modal titles |
| `type-heading-04` | 28 / 36 | POS page titles |
| `type-heading-05` | 32 / 40 | Customer-portal page titles |

### Motion and elevation

`ease-productive` (standard), `ease-entrance`, `ease-exit`; durations 70ms (fast-01, hovers),
110ms (fast-02, buttons), 150ms and 240ms (overlays). `shadow-float` (`0 2px 6px rgb(0 0 0/.3)`) is
the only shadow, used by menus, popovers, selects, modals and sheets.

### Focus

A 2px solid `--ring` outline. Inside fields, tabs and tiles it is inset (`-outline-offset-2`); on
buttons it sits on the edge with a 1px inner gap. Invalid fields use the same outline in
`--destructive`.

## Components

| Component | Carbon equivalent | Spec |
|---|---|---|
| `Button` | Button | Pill. `sm` 32px, default 40px, `lg` 48px; 14px regular label. Variants: `default` (primary), `cta`, `outline` (tertiary), `secondary`, `ghost`, `destructive` (danger), `link`. One primary/CTA per view. |
| `Input`, `Textarea`, `NativeSelect`, `SelectTrigger`, `InputGroup` | Text input, Select | 40px, `bg-field`, square, 1px `border-strong` bottom rule, inset focus outline. |
| `Label` | Form label | `label-01`, muted colour, sits 8px above the field. |
| `Card` | Tile | `bg-layer`, no border, radius or shadow, 16px padding (`size="sm"` 12px). Place on `bg-canvas`. |
| `Table` | Data table | Header row `bg-layer-accent`, 48px, semibold; body rows 48px with a subtle rule, hover `bg-layer-hover`; 16px cell padding. |
| `Tabs` | Tabs (line) | 40px tabs over a 1px rule; active tab gets a 2px `--primary` bar and semibold label. |
| `Badge` | Tag | 24px pill, `label-01`. Status variants keep the booking-phase colours. |
| `Alert` | Inline notification | Square, 3px leading bar in the variant colour. |
| `Dialog`, `AlertDialog`, `Sheet` | Modal, Side panel | Square `bg-layer`, `shadow-float`, 50% neutral overlay, `heading-03` title. |
| `DropdownMenu`, `Select` content, `Popover`, `Command` | Menu, Popover | Square, `shadow-float`, 40px items with 16px side padding. |
| `Checkbox` | Checkbox | 16px, 2px radius, 1px foreground border. |
| `Accordion` | Accordion | 40px rows, 16px padding, hover fill (no underline). |
| `Tooltip` | Tooltip | Dark, 2px radius, `label-01`. |
| `Progress`, `Skeleton` | Progress bar, Skeleton | Square; `bg-layer-accent` track. |

## Shell (`components/layout/`)

- **`PosHeader`**: Carbon UI shell header. 48px, BayFlow navy-black. Product name ("BayFlow POS")
  on the left, then full-height square header items (shop switcher, role, links). Menus open as
  square header panels flush under the bar.
- **`PosSidebar`**: Carbon side nav. 256px, `bg-layer` with a subtle right rule; 32px semibold
  items, hover `bg-layer-hover`, active `bg-layer-selected` plus a 3px brand-orange bar; group
  labels in `label-01` helper colour.
- **Shop layout**: content on `bg-canvas`, max width `screen-2xl`, 16/32px gutters, 24/32px top
  spacing.
- **`PageHeader`**: `heading-04` (POS) or `heading-05` (portal) title, `body-01` description,
  actions bottom-aligned on the right; 24px below.

## Rules for new screens

- Start from `components/ui`; do not hand-roll buttons, fields or tables.
- Do not add `rounded-*` to surfaces (the radius is 0 anyway) or `shadow-*` to anything that does
  not float. Hand-made buttons and links styled as buttons must be `rounded-full`.
- Labels and table headers are sentence case: no `uppercase`, no wide tracking.
- Heaviest weight is `font-semibold`.
- Tiles go on `bg-canvas`; fields inside tiles use `bg-field`.
