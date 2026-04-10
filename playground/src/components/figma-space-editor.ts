import { state, SPACE_KEYS, el, inputBlock, schedule, onUpdate } from "./figma-state.js";

export class FigmaSpaceEditor extends HTMLElement {
  connectedCallback() {
    this.build();
    onUpdate(() => this.updateBars());
  }

  private build() {
    this.innerHTML = "";
    for (const k of SPACE_KEYS) {
      const row = el("div", { class: "token-row" });
      row.append(el("div", { class: "token-row__head" }, [el("code", {}, [`--space-${k}`])]));

      const minInput = el("input", { type: "number", min: "0", step: "1", value: String(state.space[k].min) });
      const maxInput = el("input", { type: "number", min: "0", step: "1", value: String(state.space[k].max) });

      minInput.addEventListener("input", () => {
        state.space[k].min = Number(minInput.value) || 0;
        schedule();
      });
      maxInput.addEventListener("input", () => {
        state.space[k].max = Number(maxInput.value) || 0;
        schedule();
      });

      const body = el("div", { class: "token-row__body" }, [
        inputBlock("min (px)", minInput, { wrapperClass: "input--compact" }),
        inputBlock("max (px)", maxInput, { wrapperClass: "input--compact" }),
        el("div", { class: "token-row__bar" }, [el("span", { class: "token-row__fill", "data-space": k })]),
      ]);

      row.append(body);
      this.append(row);
    }
  }

  private updateBars() {
    const maxOfAll = Math.max(...SPACE_KEYS.map((k) => state.space[k].max));
    for (const k of SPACE_KEYS) {
      const fill = this.querySelector<HTMLElement>(`[data-space="${k}"]`);
      if (!fill) continue;
      fill.style.width = `${(state.space[k].max / maxOfAll) * 100}%`;
    }
  }
}

customElements.define("figma-space-editor", FigmaSpaceEditor);
