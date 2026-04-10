import "./index.css";
import "./components/figma-state.js";
import "./components/figma-space-editor.js";
import "./components/figma-neutral-editor.js";
import "./components/figma-accent-editor.js";
import "./components/figma-grid-editor.js";
import "./components/figma-radius-editor.js";
import "./components/figma-preview.js";
import "./components/figma-export.js";

import { schedule } from "./components/figma-state.js";

document.addEventListener("DOMContentLoaded", () => {
  schedule();
});
