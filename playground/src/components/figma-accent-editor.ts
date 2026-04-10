import { state, el, inputBlock, slugify, cssToOklch, accentToHex, schedule, onUpdate } from "./figma-state.js";

let accentCounter = 1;

export class FigmaAccentEditor extends HTMLElement {
  connectedCallback() {
    this.buildHeader();
    this.buildRows();
    onUpdate(() => this.refreshSwatches());
  }

  private buildHeader() {
    const header = el("div", { class: "flow-row has-justify-between has-items-center" });
    header.append(el("h3", { class: "has-size-6" }, ["Accents"]));

    const addBtn = el("button", { type: "button", class: "button button--outline has-size-8 has-ml-a" }, ["+ Add accent"]);
    addBtn.addEventListener("click", () => {
      accentCounter += 1;
      state.accents.push({
        id: `acc-${accentCounter}`,
        name: `brand-${accentCounter}`,
        l: 0.7,
        c: 0.18,
        h: 200,
      });
      this.rebuildRows();
      schedule();
    });
    header.append(addBtn);
    this.append(header);
  }

  private buildRows() {
    let rows = this.querySelector<HTMLElement>(".figma-accent-rows");
    if (!rows) {
      rows = el("div", { class: "figma-accent-rows flow has-gap-m has-mt-s" });
      this.append(rows);
    }
    rows.innerHTML = "";

    for (const a of state.accents) {
      const row = el("div", { class: "token-row" });

      const head = el("div", { class: "token-row__head" }, [
        el("code", {}, [`--color-${slugify(a.name)}`]),
      ]);
      if (a.id !== "accent") {
        const del = el("button", { type: "button", class: "button button--outline figma-del has-ml-a has-size-5" }, [el("span", {}, ["\u00d7"])]);
        del.addEventListener("click", () => {
          state.accents = state.accents.filter((x) => x.id !== a.id);
          this.rebuildRows();
          schedule();
        });
        head.append(del);
      }
      row.append(head);

      const nameInput = el("input", { type: "text", value: a.name });
      nameInput.addEventListener("input", () => {
        a.name = nameInput.value || "accent";
        const codeEl = head.querySelector("code");
        if (codeEl) codeEl.textContent = `--color-${slugify(a.name)}`;
        schedule();
      });

      const colorInput = el("input", { type: "color", value: accentToHex(a) });
      const hexInput = el("input", { type: "text", value: accentToHex(a) });

      const updateFromHex = (hex: string) => {
        const oklch = cssToOklch(hex);
        a.l = oklch.l;
        a.c = oklch.c;
        a.h = oklch.h;
        schedule();
      };

      colorInput.addEventListener("input", () => {
        hexInput.value = colorInput.value;
        updateFromHex(colorInput.value);
      });

      hexInput.addEventListener("change", () => {
        const val = hexInput.value.trim();
        if (/^#?[0-9a-f]{3,8}$/i.test(val)) {
          const hex = val.startsWith("#") ? val : `#${val}`;
          colorInput.value = hex.length === 7 ? hex : rgbNormalize(hex);
          hexInput.value = colorInput.value;
          updateFromHex(hex);
        }
      });

      const swatch = el("div", { class: "swatch", "data-accent-id": a.id });
      swatch.style.background = `var(--color-${slugify(a.name)})`;

      const body = el("div", { class: "token-row__body" }, [
        inputBlock("Name", nameInput, { wrapperClass: "input--compact" }),
        inputBlock("Color", colorInput, { wrapperClass: "input--compact" }),
        inputBlock("Hex", hexInput, { wrapperClass: "input--compact" }),
        swatch,
      ]);

      row.append(body);
      rows.append(row);
    }
  }

  private rebuildRows() {
    this.buildRows();
  }

  private refreshSwatches() {
    this.querySelectorAll<HTMLElement>("[data-accent-id]").forEach((sw) => {
      const id = sw.dataset.accentId;
      const a = state.accents.find((x) => x.id === id);
      if (a) sw.style.background = `var(--color-${slugify(a.name)})`;
    });
  }
}

/** Normalize short/non-standard hex to 6-digit for <input type="color">. */
function rgbNormalize(hex: string): string {
  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.fillStyle = hex;
  return ctx.fillStyle as string;
}

customElements.define("figma-accent-editor", FigmaAccentEditor);
