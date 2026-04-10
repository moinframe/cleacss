import {
  state, SPACE_KEYS, GRID_KEYS, NEUTRAL_STEPS,
  buildClampCss, fmt, slugify, oklchString,
  computeNeutralColor, computeAccentColor,
  onUpdate,
} from "./figma-state.js";

const MODE_LIGHT = "1:0";
const MODE_DARK = "1:1";

function floatVar(id: string, name: string, value: number) {
  return {
    id: `VariableID:${id}`,
    name,
    description: "",
    type: "FLOAT",
    valuesByMode: { [MODE_LIGHT]: value, [MODE_DARK]: value },
    resolvedValuesByMode: {
      [MODE_LIGHT]: { resolvedValue: value, alias: null },
      [MODE_DARK]: { resolvedValue: value, alias: null },
    },
    scopes: ["ALL_SCOPES"],
    hiddenFromPublishing: false,
    codeSyntax: {},
  };
}

function colorVar(
  id: string,
  name: string,
  light: { r: number; g: number; b: number; a: number },
  dark: { r: number; g: number; b: number; a: number }
) {
  return {
    id: `VariableID:${id}`,
    name,
    description: "",
    type: "COLOR",
    valuesByMode: { [MODE_LIGHT]: light, [MODE_DARK]: dark },
    resolvedValuesByMode: {
      [MODE_LIGHT]: { resolvedValue: light, alias: null },
      [MODE_DARK]: { resolvedValue: dark, alias: null },
    },
    scopes: ["ALL_SCOPES"],
    hiddenFromPublishing: false,
    codeSyntax: {},
  };
}

function generateCssBlock(): string {
  const lines: string[] = [":root {"];
  lines.push("  /* Space */");
  for (const k of SPACE_KEYS) {
    lines.push(`  --space-${k}: ${buildClampCss(state.space[k].min, state.space[k].max)};`);
  }
  lines.push("");
  lines.push("  /* Color \u2013 neutrals */");
  lines.push(`  --color-neutral-h: ${state.neutralH};`);
  lines.push(`  --color-neutral-c: ${state.neutralC};`);
  lines.push("");
  lines.push("  /* Color \u2013 accents */");
  for (const a of state.accents) {
    lines.push(`  --color-${slugify(a.name)}: ${oklchString(a)};`);
  }
  lines.push("");
  lines.push("  /* Grid */");
  for (const k of GRID_KEYS) {
    lines.push(`  --grid-width-${k}: ${fmt(state.grid[k] / 16)}rem;`);
  }
  lines.push("");
  lines.push("  /* Border radius */");
  lines.push(`  --border-radius: ${state.radius.default}px;`);
  lines.push(`  --border-radius-s: ${state.radius.small}px;`);
  lines.push(`  --border-radius-rounded: ${state.radius.rounded}px;`);
  lines.push("}");
  return lines.join("\n");
}

function generateFigmaJson() {
  const variables: any[] = [];

  for (const k of SPACE_KEYS) {
    variables.push(floatVar(`space-${k}`, `Space/space-${k}`, state.space[k].max));
  }

  for (const step of NEUTRAL_STEPS) {
    const { light, dark } = computeNeutralColor(step);
    variables.push(colorVar(`color-neutral-${step}`, `Color/neutral-${step}`, light, dark));
  }

  for (const a of state.accents) {
    const { light, dark } = computeAccentColor(a);
    variables.push(colorVar(`color-${slugify(a.name)}`, `Color/${slugify(a.name)}`, light, dark));
  }

  for (const k of GRID_KEYS) {
    variables.push(floatVar(`grid-width-${k}`, `Grid/grid-width-${k}`, state.grid[k]));
  }

  variables.push(floatVar("border-radius-default", "Border Radius/default", state.radius.default));
  variables.push(floatVar("border-radius-small", "Border Radius/small", state.radius.small));
  variables.push(floatVar("border-radius-rounded", "Border Radius/rounded", state.radius.rounded));

  return {
    id: "VariableCollectionId:cleacss",
    name: "cleacss",
    modes: { [MODE_LIGHT]: "Light", [MODE_DARK]: "Dark" },
    variableIds: variables.map((v) => v.id),
    variables,
  };
}

function downloadJson(obj: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function flashButton(el: HTMLElement, text: string) {
  const original = el.textContent;
  el.textContent = text;
  setTimeout(() => { el.textContent = original; }, 1200);
}

export class FigmaExport extends HTMLElement {
  connectedCallback() {
    this.refreshCss();
    this.bindButtons();
    onUpdate(() => this.refreshCss());
  }

  private refreshCss() {
    const out = this.querySelector<HTMLElement>("[data-css-output]");
    if (out) out.textContent = generateCssBlock();
  }

  private bindButtons() {
    this.querySelector<HTMLElement>("[data-copy-css]")?.addEventListener("click", async (e) => {
      const btn = e.currentTarget as HTMLElement;
      try {
        await navigator.clipboard.writeText(generateCssBlock());
        flashButton(btn, "Copied!");
      } catch {
        flashButton(btn, "Copy failed");
      }
    });

    this.querySelector<HTMLElement>("[data-download-json]")?.addEventListener("click", () => {
      downloadJson(generateFigmaJson(), "cleacss.figma.json");
    });
  }
}

customElements.define("figma-export", FigmaExport);
