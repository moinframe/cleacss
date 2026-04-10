import { state, el, slugify, applyNeutralOverrides, onUpdate } from "./figma-state.js";

export class FigmaPreview extends HTMLElement {
  private previewBox: HTMLElement | null = null;
  private currentMode: "light" | "dark" = "light";

  connectedCallback() {
    this.previewBox = this.querySelector<HTMLElement>("[data-preview-box]");
    this.buildToggle();
    this.buildAccents();
    this.applyMode();
    onUpdate(() => {
      this.buildAccents();
      this.applyMode();
    });
  }

  private applyMode() {
    if (!this.previewBox) return;
    applyNeutralOverrides(this.previewBox, this.currentMode);
  }

  private buildToggle() {
    const toggle = this.querySelector<HTMLButtonElement>("[data-preview-toggle]");
    if (!toggle || !this.previewBox) return;

    const box = this.previewBox;
    toggle.addEventListener("click", () => {
      this.currentMode = this.currentMode === "light" ? "dark" : "light";
      box.dataset.mode = this.currentMode;
      box.style.colorScheme = this.currentMode;
      this.applyMode();
      toggle.querySelector("span")!.textContent = `Switch to ${this.currentMode === "light" ? "dark" : "light"}`;
    });
  }

  private buildAccents() {
    const host = this.querySelector<HTMLElement>("[data-preview-accents]");
    if (!host) return;
    host.innerHTML = "";
    for (const a of state.accents) {
      const chip = el("span", { class: "figma-preview__chip" });
      chip.style.background = `var(--color-${slugify(a.name)})`;
      host.append(chip);
    }
  }

}

customElements.define("figma-preview", FigmaPreview);
