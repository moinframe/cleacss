---
title: Color Scheme
---

Force a section into dark or light mode, regardless of the user's system preference.

## Usage

```html
<section class="is-dark">
  <p>This section is always in dark mode.</p>
</section>

<section class="is-light">
  <p>This section is always in light mode.</p>
</section>
```

The `.is-dark` and `.is-light` classes set `color-scheme` on the element and re-declare all neutral color variables so that `light-dark()` resolves locally. Background and text colors are applied automatically.

## Customization

Overriding `--color-neutral-h` and `--color-neutral-c` on `:root` affects all neutral shades everywhere, including inside `.is-dark` and `.is-light` sections. If you specifically want to override a neutral color like `--color-neutral-400`, you have to do it on `:root` and then re-declare it on `.is-dark` and `.is-light`.
