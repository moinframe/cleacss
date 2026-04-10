import { NEUTRAL_STEPS, el, computeNeutralColor, rgbaToHex, state, schedule, onUpdate } from "./figma-state.js";

export class FigmaNeutralEditor extends HTMLElement {
  connectedCallback() {
    this.buildControls();
    this.buildSwatches();
    onUpdate(() => this.updateHexes());
  }

  private buildControls() {
    const controls = el("div", { class: "flow-row has-gap-m has-flex-wrap" });

    const hueInput = el("input", { type: "range", id: "figma-hue-input", min: "0", max: "360", step: "1", value: String(state.neutralH) });
    const hueValue = el("span", { class: "message" }, [String(state.neutralH)]);
    const hueWrap = el("div", { class: "input" }, [
      el("label", { for: "figma-hue-input" }, ["Hue ", el("code", {}, ["--color-neutral-h"])]),
      hueInput,
      hueValue,
    ]);

    const chromaInput = el("input", { type: "range", id: "figma-chroma-input", min: "0", max: "0.4", step: "0.001", value: String(state.neutralC) });
    const chromaValue = el("span", { class: "message" }, [String(state.neutralC)]);
    const chromaWrap = el("div", { class: "input" }, [
      el("label", { for: "figma-chroma-input" }, ["Chroma ", el("code", {}, ["--color-neutral-c"])]),
      chromaInput,
      chromaValue,
    ]);

    hueInput.addEventListener("input", () => {
      state.neutralH = Number(hueInput.value);
      hueValue.textContent = hueInput.value;
      schedule();
    });
    chromaInput.addEventListener("input", () => {
      state.neutralC = Number(chromaInput.value);
      chromaValue.textContent = chromaInput.value;
      schedule();
    });

    controls.append(hueWrap, chromaWrap);
    this.append(controls);
  }

  private buildSwatches() {
    const host = el("div", { class: "flow-row has-flex-wrap has-gap-s has-mt-s" });
    for (const step of NEUTRAL_STEPS) {
      const col = el("div", { class: "flow has-items-center has-gap-2xs has-w-auto" });
      const sw = el("div", { class: `swatch has-background-neutral-${step}` });
      if (step === 50) sw.style.border = "1px solid var(--color-neutral-200)";
      const label = el("span", { class: "figma-mono" }, [String(step)]);
      const hexL = el("code", { class: "figma-mono figma-hex", "data-hex-light": String(step) });
      const hexD = el("code", { class: "figma-mono figma-hex figma-hex--dark", "data-hex-dark": String(step) });
      col.append(sw, label, hexL, hexD);
      host.append(col);
    }
    this.append(host);
  }

  private updateHexes() {
    for (const step of NEUTRAL_STEPS) {
      const { light, dark } = computeNeutralColor(step);
      const lEl = this.querySelector<HTMLElement>(`[data-hex-light="${step}"]`);
      const dEl = this.querySelector<HTMLElement>(`[data-hex-dark="${step}"]`);
      if (lEl) lEl.textContent = `L ${rgbaToHex(light)}`;
      if (dEl) dEl.textContent = `D ${rgbaToHex(dark)}`;
    }
  }
}

customElements.define("figma-neutral-editor", FigmaNeutralEditor);
