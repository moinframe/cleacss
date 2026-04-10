import { state, RadiusKey, el, inputBlock, schedule } from "./figma-state.js";

const ITEMS: Array<{ key: RadiusKey; cssVar: string }> = [
  { key: "default", cssVar: "--border-radius" },
  { key: "small", cssVar: "--border-radius-s" },
  { key: "rounded", cssVar: "--border-radius-rounded" },
];

export class FigmaRadiusEditor extends HTMLElement {
  connectedCallback() {
    this.build();
  }

  private build() {
    this.innerHTML = "";
    for (const it of ITEMS) {
      const row = el("div", { class: "token-row" });
      row.append(el("div", { class: "token-row__head" }, [el("code", {}, [it.cssVar])]));

      const input = el("input", { type: "number", min: "0", step: "1", value: String(state.radius[it.key]) });
      input.addEventListener("input", () => {
        state.radius[it.key] = Number(input.value) || 0;
        schedule();
      });

      const preview = el("div", { class: "token-row__radius-preview" });
      preview.style.borderRadius = `var(${it.cssVar})`;

      const body = el("div", { class: "token-row__body" }, [
        inputBlock("Radius (px)", input, { wrapperClass: "input--compact" }),
        preview,
      ]);

      row.append(body);
      this.append(row);
    }
  }
}

customElements.define("figma-radius-editor", FigmaRadiusEditor);
