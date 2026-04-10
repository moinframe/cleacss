import { state, GRID_KEYS, el, inputBlock, schedule, onUpdate } from "./figma-state.js";

export class FigmaGridEditor extends HTMLElement {
  connectedCallback() {
    this.build();
    onUpdate(() => this.updateBars());
  }

  private build() {
    this.innerHTML = "";
    for (const k of GRID_KEYS) {
      const row = el("div", { class: "token-row" });
      row.append(el("div", { class: "token-row__head" }, [el("code", {}, [`--grid-width-${k}`])]));

      const input = el("input", { type: "number", min: "0", step: "1", value: String(state.grid[k]) });
      input.addEventListener("input", () => {
        state.grid[k] = Number(input.value) || 0;
        schedule();
      });

      const body = el("div", { class: "token-row__body" }, [
        inputBlock("Width (px)", input, { wrapperClass: "input--compact" }),
        el("div", { class: "token-row__bar" }, [el("span", { class: "token-row__fill", "data-grid": k })]),
      ]);

      row.append(body);
      this.append(row);
    }
  }

  private updateBars() {
    const maxOfAll = Math.max(...GRID_KEYS.map((k) => state.grid[k]));
    for (const k of GRID_KEYS) {
      const fill = this.querySelector<HTMLElement>(`[data-grid="${k}"]`);
      if (!fill) continue;
      fill.style.width = `${(state.grid[k] / maxOfAll) * 100}%`;
    }
  }
}

customElements.define("figma-grid-editor", FigmaGridEditor);
