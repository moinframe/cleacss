---
title: Grid
---

Cleacss comes with a 14 column grid system, which is meant to be the most outer layer of your layout. Inside you can use subgrids to create individual components that are consistent with the rest of the layout.

Using the `grid` class, you create a grid where the most outer columns are spaced dynamically, while the inner 12 columns are spaced evenly. This can be compared to a container approach in other frameworks.

Inside the `grid` you can use `span-x` classes to define the width of elments, by default, all elements will span 1 of 14 columns.

To get more complex layouts, you can nest `grid` or use `subgrid` to create subgrids. Both classes will work the same way, it's just a matter of preference.

A subgrid will retain the same gap as the parent grid, but will have a different width, and a different number of columns.

```html
<div class="grid">
  <div class="subgrid span-6">
    <div class="span-3">Only 6 columns max</div>
    <div class="span-3">Only 6 columns max</div>
  </div>
  <div class="grid span-4">
    <div class="span-1">Only 4 columns max</div>
    <div class="span-3">Only 4 columns max</div>
  </div>
</div>
```

When you're used to other frameworks, this approach might be new to you. But it's a great way to have consistent layouts across your site.

## Named columns

There are two classes that can be used to set an elements width to a common width. The `span-full` class will set the element to 100% of the grid width, and `span-content` will set the element to the width of the content.

```html
<div class="grid">
  <div class="span-full">Full width</div>
  <div class="span-content">
    <h1>This is a heading</h1>
    <p>This is a paragraph</p>
  </div>
</div>
```

## Responsive columns

You can attach the name of the breakpoint prefixed by a `:` to a `span-x` class to make it responsive. For example `span-5:xl` There are 5 breakpoints built-in, which are `s`, `m`, `l`, `xl` and `2xl`

```html
<div class="grid">
  <div class="subgrid span-12 span-6:m">
    <div class="span-3">Only 6 columns max</div>
    <div class="span-3">Only 6 columns max</div>
  </div>
  <div class="subgrid span-12 span-4:m">
    <div class="span-1">Only 4 columns max</div>
    <div class="span-3">Only 4 columns max</div>
  </div>
</div>
```

All breakpoints are min-width based, so several of them match at once on a wide screen. When they do, **the last matching breakpoint wins**, regardless of how many columns it spans. Spans may therefore grow *or* shrink as the viewport gets wider — `span-4:s span-8:m` and `span-8:s span-4:m` both do what they read like.

An un-suffixed class such as `span-full` or `span-6` acts as the base value and is overridden by every breakpoint that matches. This is what makes a card grid that gets denser on larger screens: one card per row by default, two from `s`, three from `m`.

```html
<div class="grid">
  <div class="subgrid span-content">
    <div class="span-full span-6:s span-4:m">Card</div>
    <div class="span-full span-6:s span-4:m">Card</div>
    <div class="span-full span-6:s span-4:m">Card</div>
  </div>
</div>
```

The same rules apply to `span-full:x`, `span-content:x` and the `start-x` classes.

## Column start

You can use the `start-x` classes to set the start column of an element. The `x` is the number of the column. It's also possible to use the responsive breakpoints. It follows the same pattern, e.g. `start-2:l` will start the element at column 2 on large screens.

```html
<div class="grid">
  <div class="span-3 start-2">Starts at column 2</div>
  <div class="span-7">Goes to the end of the screen</div>
  <div class="span-12 span-4:l start-2:l">I'm responsive</div>
</div>
```


## Gap

You can change the gap between elements using the `--grid-gap-x` and `--grid-gap-y` custom properties. The default value is `var(--space-s-l)`.

```css
:root {
  --grid-gap-y: var(--space-default);
  --grid-gap-x: var(--space-default);
}
```

You can also use modifier classes to change these properties. There are classes for each direction and size. There is `has-gap-x-0` and `has-gap-y-0` to set the gap to 0. You can also use the sizes `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl` and `4xl`, e.g. `has-gap-y-xl`.

```html
<div class="grid has-gap-y-xl">
  <div class="span-content">
    Section 1
  </div>
  <div class="span-content">
    Section 2
  </div>
</div>
```

## Reset the grid

If you want to create a new grid inside some element, use the `grid-reset` class. This does only make sense for elements, that span the full width of the browser, but will create a new grid.

A good usecase is the usage inside a full width flow element.

```html
<div class="grid">
    <div class="span-content flow">
      <p>
        Sed placerat eros aenean lorem aptent fames vitae vehicula taciti metus tempor magnis consectetur ultrices
        libero consequat est ac varius potenti ornare enim dapibus accumsan nascetur pellentesque conubia velit blandit
        parturient quisque donec netus dignissim bibendum iaculis id habitant litora
      </p>
      <blockquote class="breakout grid-reset" style="background: var(--color-neutral-100);">
        <p class="has-size-4 span-content">
          This quote will break out of the flow and this text will align perfectly with the main content.
        </p>
      </blockquote>
      <p>
        Dis consectetur cras fusce nisi consequat congue vivamus ridiculus habitasse porta ullamcorper natoque curae
        justo eu lobortis rutrum hac bibendum
      </p>
    </div>
  </div>
```


## Configuration

You can change the grid width, gap and margins using the following custom properties.

The `--grid-width` is the width of the **content area**, the margins are the space between the content and the edges of the screen, and the gap is the space between the columns. Each grid width corresponds to a breakpoint, e.g. `--grid-width-s` is the maximum width of the columns 2 to 12 (`span-content`) on small screens. There are media queries in place that change the `--grid-width` property based on the breakpoint.

```css
:root {
  --grid-width-s: 40rem; // 640px
  --grid-width-m: 45rem; // 720px
  --grid-width-l: 60rem; // 960px
  --grid-width-xl: 82rem; // 1312px
  --grid-width-2xl: 90rem; // 1440px
  --grid-width: var(--grid-width-s);
  --grid-margin-min: 0;
  --grid-margin-max: calc(((100vw - var(--grid-gap-x) * 2) - var(--grid-width)) / 2);
  --grid-gap-y: var(--space-default);
  --grid-gap-x: var(--space-default);
}

```
