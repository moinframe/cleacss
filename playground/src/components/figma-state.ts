/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type SpaceKey = "2xs" | "xs" | "s" | "m" | "l" | "xl" | "2xl" | "3xl" | "4xl";
export type GridKey = "s" | "m" | "l" | "xl" | "2xl";
export type RadiusKey = "default" | "small" | "rounded";

export interface Accent {
  id: string;
  name: string;
  l: number;
  c: number;
  h: number;
}

export interface State {
  space: Record<SpaceKey, { min: number; max: number }>;
  neutralH: number;
  neutralC: number;
  accents: Accent[];
  grid: Record<GridKey, number>;
  radius: Record<RadiusKey, number>;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const SPACE_KEYS: SpaceKey[] = ["2xs", "xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl"];
export const GRID_KEYS: GridKey[] = ["s", "m", "l", "xl", "2xl"];
export const NEUTRAL_STEPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] as const;

/* ------------------------------------------------------------------ */
/*  Shared state                                                       */
/* ------------------------------------------------------------------ */

export const state: State = {
  space: {
    "2xs": { min: 4, max: 5 },
    "xs": { min: 8, max: 10 },
    "s": { min: 16, max: 20 },
    "m": { min: 24, max: 30 },
    "l": { min: 32, max: 40 },
    "xl": { min: 48, max: 60 },
    "2xl": { min: 64, max: 80 },
    "3xl": { min: 96, max: 120 },
    "4xl": { min: 128, max: 160 },
  },
  neutralH: 300,
  neutralC: 0.01,
  accents: [{ id: "accent", name: "accent", l: 0.65, c: 0.4, h: 280 }],
  grid: { s: 640, m: 720, l: 960, xl: 1312, "2xl": 1440 },
  radius: { default: 4, small: 2, rounded: 4096 },
};

/* ------------------------------------------------------------------ */
/*  Color helpers                                                      */
/* ------------------------------------------------------------------ */

const ctx = document.createElement("canvas").getContext("2d")!;

export function oklchToRgba(css: string) {
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 };
}

export function rgbaToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const h = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return "#" + h(r) + h(g) + h(b);
}

/** Convert any CSS color string to an oklch {l, c, h} object via canvas + math. */
export function cssToOklch(css: string): { l: number; c: number; h: number } {
  const { r, g, b } = oklchToRgba(css);

  // Linear sRGB
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const rl = lin(r), gl = lin(g), bl = lin(b);

  // sRGB → LMS (via OKLab M1 matrix)
  const l_ = Math.cbrt(0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl);
  const m_ = Math.cbrt(0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl);
  const s_ = Math.cbrt(0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl);

  // LMS → OKLab
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  // OKLab → OKLCH
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;

  return {
    l: Math.round(L * 1000) / 1000,
    c: Math.round(C * 1000) / 1000,
    h: Math.round(H),
  };
}

/** Convert an Accent's oklch values to a hex string. */
export function accentToHex(a: Accent): string {
  return rgbaToHex(oklchToRgba(oklchString(a)));
}

/* ------------------------------------------------------------------ */
/*  Neutral lightness mapping (mirrors _colors.scss)                   */
/* ------------------------------------------------------------------ */

const NEUTRAL_LIGHTNESS: Record<number, { light: number; dark: number }> = {
  0:    { light: 1,    dark: 0 },
  50:   { light: 0.95, dark: 0.1 },
  100:  { light: 0.9,  dark: 0.15 },
  200:  { light: 0.8,  dark: 0.2 },
  300:  { light: 0.7,  dark: 0.3 },
  400:  { light: 0.6,  dark: 0.4 },
  500:  { light: 0.5,  dark: 0.5 },
  600:  { light: 0.4,  dark: 0.6 },
  700:  { light: 0.3,  dark: 0.7 },
  800:  { light: 0.2,  dark: 0.8 },
  900:  { light: 0.1,  dark: 0.85 },
  1000: { light: 0,    dark: 0.95 },
};

export function neutralOklch(step: number, mode: "light" | "dark") {
  const l = NEUTRAL_LIGHTNESS[step][mode];
  return `oklch(${l} ${state.neutralC} ${state.neutralH})`;
}

export function computeNeutralColor(step: number) {
  return {
    light: oklchToRgba(neutralOklch(step, "light")),
    dark: oklchToRgba(neutralOklch(step, "dark")),
  };
}

export function computeAccentColor(a: Accent) {
  const rgba = oklchToRgba(oklchString(a));
  return { light: rgba, dark: rgba };
}

/** Set neutral variable overrides on a container for the given mode. */
export function applyNeutralOverrides(element: HTMLElement, mode: "light" | "dark") {
  for (const step of NEUTRAL_STEPS) {
    element.style.setProperty(`--color-neutral-${step}`, neutralOklch(step, mode));
  }
}

/* ------------------------------------------------------------------ */
/*  Utility helpers                                                    */
/* ------------------------------------------------------------------ */

/** Format a number to up to 4 decimal places, stripping trailing zeros. */
export function fmt(n: number): string {
  return parseFloat(n.toFixed(4)).toString();
}

export function buildClampCss(minPx: number, maxPx: number): string {
  if (minPx === maxPx) return `${fmt(minPx / 16)}rem`;
  const slopePxPerPx = (maxPx - minPx) / (1920 - 480);
  const interceptPx = minPx - slopePxPerPx * 480;
  return `clamp(${fmt(minPx / 16)}rem, ${fmt(interceptPx / 16)}rem + ${fmt(slopePxPerPx * 100)}vw, ${fmt(maxPx / 16)}rem)`;
}

export function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "accent";
}

export function oklchString(a: Accent) {
  return `oklch(${a.l} ${a.c} ${a.h})`;
}

/* ------------------------------------------------------------------ */
/*  DOM helpers                                                        */
/* ------------------------------------------------------------------ */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  children: (Node | string)[] = []
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.append(c);
  return node;
}

let uid = 0;
export const nextId = (prefix: string) => `${prefix}-${++uid}`;

export function inputBlock(
  labelText: string,
  input: HTMLInputElement,
  opts: { message?: HTMLElement; wrapperClass?: string } = {}
) {
  if (!input.id) input.id = nextId("figma-in");
  const label = el("label", { for: input.id }, [labelText]);
  const wrap = el("div", { class: `input ${opts.wrapperClass ?? ""}`.trim() }, [label, input]);
  if (opts.message) wrap.append(opts.message);
  return wrap;
}


/* ------------------------------------------------------------------ */
/*  Apply state to :root                                               */
/* ------------------------------------------------------------------ */

export function applyToRoot() {
  const root = document.documentElement.style;

  for (const k of SPACE_KEYS) {
    root.setProperty(`--space-${k}`, buildClampCss(state.space[k].min, state.space[k].max));
  }

  root.setProperty("--color-neutral-h", String(state.neutralH));
  root.setProperty("--color-neutral-c", String(state.neutralC));

  for (const a of state.accents) {
    root.setProperty(`--color-${slugify(a.name)}`, oklchString(a));
  }

  for (const k of GRID_KEYS) {
    root.setProperty(`--grid-width-${k}`, `${fmt(state.grid[k] / 16)}rem`);
  }

  root.setProperty("--border-radius", `${state.radius.default}px`);
  root.setProperty("--border-radius-s", `${state.radius.small}px`);
  root.setProperty("--border-radius-rounded", `${state.radius.rounded}px`);
}

/* ------------------------------------------------------------------ */
/*  Scheduled update                                                   */
/* ------------------------------------------------------------------ */

const UPDATE_EVENT = "figma-state-update";

let frame = 0;
export function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    applyToRoot();
    document.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  });
}

export function onUpdate(callback: () => void) {
  document.addEventListener(UPDATE_EVENT, callback);
}
