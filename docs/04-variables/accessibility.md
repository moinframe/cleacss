---
title: Accessibility
---

cleacss provides a consistent focus outline used by all interactive elements (buttons, inputs, links). Centralizing it here means you can update the entire focus style in one place.

## Variables

```css
:root {
  --outline-color: var(--color-accent);
  --outline-width: 2px;
  --outline-offset: 0.15em;
}
```

## Customization

Override the outline globally:

```css
:root {
  --outline-color: var(--color-info); /* Blue focus rings */
  --outline-width: 3px;
  --outline-offset: 0.25em;
}
```

Or apply a custom outline to a single element:

```css
.my-input {
  --input-outline-color: var(--color-success);
}
```

> Input, button, and other interactive elements each have their own `--*-outline-*` variables that default to these root values. Override the root to restyle all at once, or override the component variable to target a specific element.
