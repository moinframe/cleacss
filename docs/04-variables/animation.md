---
title: Animation
---

cleacss provides a set of easing curves and a default duration so transitions feel consistent across the whole UI.

## Default transition

```css
:root {
  --animation-duration: 0.3s;
  --animation-ease: var(--ease-out);
}
```

Use these together when adding transitions to your own components:

```css
.my-element {
  transition: opacity var(--animation-duration) var(--animation-ease);
}
```

## Easing curves

| Variable                    | Curve                                    | Feel                         |
| --------------------------- | ---------------------------------------- | ---------------------------- |
| `--ease-out`                | `cubic-bezier(0, 0, 0.2, 1)`            | Fast start, gentle stop      |
| `--ease-in-out`             | `cubic-bezier(0.4, 0, 0.2, 1)`          | Smooth both ends             |
| `--ease-out-emphasized`     | `cubic-bezier(0.18, 0.89, 0.32, 1.28)`  | Slight overshoot at end      |
| `--ease-in-out-emphasized`  | `cubic-bezier(0.87, 0, 0.13, 1)`        | Strong acceleration          |
| `--ease-out-back`           | `cubic-bezier(0.34, 1.56, 0.64, 1)`     | Bouncy overshoot             |
| `--ease-jump`               | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Springy both ends            |

## Usage

```css
/* Smooth panel slide */
.panel {
  transition: transform var(--animation-duration) var(--ease-out-emphasized);
}

/* Springy button press */
.button:active {
  transition: transform 0.15s var(--ease-out-back);
}
```
