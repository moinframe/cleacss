---
title: Border Radius
---

cleacss provides three border radius tokens that are shared across all components.

## Variables

```css
:root {
  --border-radius: 4px;          /* Default – buttons, cards, dialogs */
  --border-radius-s: 2px;        /* Subtle – inputs, table cells */
  --border-radius-rounded: 4096px; /* Pill – pill buttons, tags, toggles */
}
```

## Usage

Override these at `:root` to restyle the entire framework at once:

```css
:root {
  --border-radius: 8px;   /* Rounder feel */
  --border-radius-s: 4px;
}
```

Or apply them on individual elements:

```css
.card {
  border-radius: var(--border-radius);
}

.badge {
  border-radius: var(--border-radius-rounded);
}
```
