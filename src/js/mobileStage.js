export const MOBILE_MODE_VALUES = ["shrink", "zoom", "stack"];
export const DEFAULT_MOBILE_MODE = "shrink";

export const MOBILE_MODE_OPTIONS = [
  {
    value: "shrink",
    label: "Shrink the stage",
    hint: "Keep the collage. Scale the whole 90s layout to the phone.",
  },
  {
    value: "zoom",
    label: "Pinch-zoom",
    hint: "Original stage size. Pan and pinch like a desktop homepage.",
  },
  {
    value: "stack",
    label: "Stack",
    hint: "One column. Easier to read, but the layout is gone.",
  },
];

/**
 * @param {unknown} value
 * @returns {"shrink"|"zoom"|"stack"}
 */
export function normalizeMobileMode(value) {
  return MOBILE_MODE_VALUES.includes(value) ? value : DEFAULT_MOBILE_MODE;
}

/**
 * Inline CSS for exported sites. Beats the old stacking stylesheet with
 * higher-specificity !important so leftover CDN copies cannot flatten the stage.
 * @param {number} stageW
 * @param {number} stageH
 * @returns {string}
 */
export function getMobileExportCss(stageW, stageH) {
  const w = Math.max(1, Math.round(stageW) || 1200);
  const h = Math.max(1, Math.round(stageH) || 800);
  return `
:root {
  --stage-w: ${w}px;
  --stage-h: ${h}px;
}
#stage-scroll {
  position: relative;
}
.exported-element {
  position: absolute;
  left: var(--el-left);
  top: var(--el-top);
  width: var(--el-width);
  height: var(--el-height);
  min-width: var(--el-min-w, 0);
  min-height: var(--el-min-h, 0);
  z-index: var(--el-z, auto);
  overflow: hidden;
}
.exported-element img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
html[data-mobile-mode="shrink"] body {
  overflow-x: hidden;
}
html[data-mobile-mode="shrink"] #app-container {
  width: min(100%, var(--stage-w));
  aspect-ratio: ${w} / ${h};
  height: auto;
  min-height: 0;
  position: relative;
  margin: 0 auto;
}
html[data-mobile-mode="zoom"] body {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}
html[data-mobile-mode="zoom"] #stage-scroll {
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  touch-action: none;
  background: inherit;
}
html[data-mobile-mode="zoom"] #app-container {
  width: var(--stage-w);
  height: var(--stage-h);
  min-height: var(--stage-h);
  position: relative;
  transform-origin: 0 0;
}
html[data-mobile-mode="stack"] #app-container {
  width: 100%;
  min-height: 100vh;
  height: auto;
  position: relative;
  margin: 0 auto;
}
html[data-mobile-mode="stack"] .exported-element {
  position: relative !important;
  left: auto !important;
  top: auto !important;
  width: min(100%, 40rem) !important;
  height: auto !important;
  min-height: 100px;
  margin: 12px auto !important;
  padding: 8px;
  box-sizing: border-box;
}
html[data-mobile-mode="stack"] .exported-element img,
html[data-mobile-mode="stack"] .exported-element iframe,
html[data-mobile-mode="stack"] .exported-element video {
  max-width: 100%;
  height: auto;
}
html[data-mobile-mode="shrink"] .exported-element,
html[data-mobile-mode="zoom"] .exported-element {
  position: absolute !important;
  left: var(--el-left) !important;
  top: var(--el-top) !important;
  width: var(--el-width) !important;
  height: var(--el-height) !important;
  min-width: var(--el-min-w, 0) !important;
  min-height: var(--el-min-h, 0) !important;
  margin: 0 !important;
  padding: 0 !important;
  font-size: unset !important;
  line-height: unset !important;
}
html[data-mobile-mode="shrink"] #app-container * + *,
html[data-mobile-mode="zoom"] #app-container * + * {
  margin-top: 0 !important;
}
html[data-mobile-mode="shrink"] #app-container .flex,
html[data-mobile-mode="zoom"] #app-container .flex {
  display: flex !important;
}
html[data-mobile-mode="shrink"] #app-container .grid,
html[data-mobile-mode="zoom"] #app-container .grid {
  display: grid !important;
}
html[data-mobile-mode="shrink"] .exported-element img,
html[data-mobile-mode="zoom"] .exported-element img {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
}
html[data-mobile-mode="zoom"] .glitchgen-footer {
  flex-shrink: 0;
}
.glitchgen-footer {
  position: relative;
  z-index: 40;
  background: #f3f4f6;
  padding: 8px 12px;
  box-shadow: 0 -1px 4px rgba(0,0,0,.12);
}
.gg-footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px 16px;
  font-size: 13px;
}
.gg-mobile-switch {
  display: inline-flex;
  border: 2px solid #1e3a8a;
  background: #c0c0c0;
  box-shadow: inset -1px -1px #fff, inset 1px 1px #808080;
}
.gg-mobile-switch button {
  appearance: none;
  border: 0;
  margin: 0;
  padding: 4px 10px;
  font: 16px VT323, monospace;
  background: transparent;
  color: #111;
  cursor: pointer;
  min-height: 32px;
}
.gg-mobile-switch button[aria-pressed="true"] {
  background: #000080;
  color: #fff;
}
.gg-credit {
  display: inline-flex;
  align-items: center;
}
`;
}

/**
 * Tiny mode switch + pinch-zoom for the original stage.
 * @param {"shrink"|"zoom"|"stack"} defaultMode
 * @param {number} stageW
 * @param {number} stageH
 * @returns {string}
 */
export function getMobileExportScript(defaultMode, stageW, stageH) {
  const mode = normalizeMobileMode(defaultMode);
  const w = Math.max(1, Math.round(stageW) || 1200);
  const h = Math.max(1, Math.round(stageH) || 800);
  return `<script>
(function () {
  var STAGE_W = ${w};
  var STAGE_H = ${h};
  var MODES = ["shrink", "zoom", "stack"];
  var html = document.documentElement;
  var scroll = document.getElementById("stage-scroll");
  var stage = document.getElementById("app-container");
  if (!scroll || !stage) return;
  var stored = null;
  try { stored = localStorage.getItem("glitchgen-mobile-mode"); } catch (e) {}
  var mode = MODES.indexOf(stored) >= 0 ? stored : ${JSON.stringify(mode)};
  var scale = 1, x = 0, y = 0;
  var pointers = [];
  var lastDist = 0;
  var panning = false;
  var zoomOn = false;

  function interactive(el) {
    return el && el.closest && el.closest("button, a, iframe, input, textarea, select, label");
  }
  function fit() {
    return Math.min(scroll.clientWidth / STAGE_W, scroll.clientHeight / STAGE_H, 1);
  }
  function clamp() {
    var sw = STAGE_W * scale;
    var sh = STAGE_H * scale;
    var cw = scroll.clientWidth;
    var ch = scroll.clientHeight;
    if (sw <= cw) x = (cw - sw) / 2;
    else x = Math.min(0, Math.max(cw - sw, x));
    if (sh <= ch) y = (ch - sh) / 2;
    else y = Math.min(0, Math.max(ch - sh, y));
  }
  function apply() {
    stage.style.transform = "translate(" + x + "px," + y + "px) scale(" + scale + ")";
  }
  function resetZoom() {
    scale = 1;
    x = 0;
    y = 0;
    stage.style.transform = "";
  }
  function zoomToFit() {
    scale = fit();
    x = 0;
    y = 0;
    clamp();
    apply();
  }
  function onPointerDown(ev) {
    if (ev.target && interactive(ev.target) && pointers.length === 0) return;
    pointers.push(ev);
    try { scroll.setPointerCapture(ev.pointerId); } catch (e) {}
    if (pointers.length === 1) {
      panning = true;
    } else if (pointers.length === 2) {
      panning = false;
      lastDist = Math.hypot(pointers[0].clientX - pointers[1].clientX, pointers[0].clientY - pointers[1].clientY);
    }
  }
  function replacePointer(ev) {
    for (var i = 0; i < pointers.length; i++) {
      if (pointers[i].pointerId === ev.pointerId) {
        pointers[i] = ev;
        return true;
      }
    }
    return false;
  }
  function onPointerMove(ev) {
    if (!replacePointer(ev)) return;
    if (pointers.length === 2 && lastDist) {
      var dist = Math.hypot(pointers[0].clientX - pointers[1].clientX, pointers[0].clientY - pointers[1].clientY);
      var mid = {
        x: (pointers[0].clientX + pointers[1].clientX) / 2,
        y: (pointers[0].clientY + pointers[1].clientY) / 2
      };
      var next = scale * (dist / lastDist);
      next = Math.max(fit() * 0.8, Math.min(4, next));
      var rect = scroll.getBoundingClientRect();
      var px = mid.x - rect.left;
      var py = mid.y - rect.top;
      var ratio = next / scale;
      x = px - (px - x) * ratio;
      y = py - (py - y) * ratio;
      scale = next;
      lastDist = dist;
      clamp();
      apply();
    } else if (panning && pointers.length === 1) {
      x += ev.movementX;
      y += ev.movementY;
      clamp();
      apply();
    }
  }
  function onPointerUp(ev) {
    pointers = pointers.filter(function (p) { return p.pointerId !== ev.pointerId; });
    if (pointers.length < 2) lastDist = 0;
    if (pointers.length === 0) panning = false;
  }
  function onWheel(ev) {
    ev.preventDefault();
    var next = scale * (ev.deltaY < 0 ? 1.08 : 0.92);
    next = Math.max(fit() * 0.8, Math.min(4, next));
    var rect = scroll.getBoundingClientRect();
    var px = ev.clientX - rect.left;
    var py = ev.clientY - rect.top;
    var ratio = next / scale;
    x = px - (px - x) * ratio;
    y = py - (py - y) * ratio;
    scale = next;
    clamp();
    apply();
  }
  function enableZoom() {
    if (zoomOn) {
      zoomToFit();
      return;
    }
    zoomOn = true;
    scroll.addEventListener("pointerdown", onPointerDown);
    scroll.addEventListener("pointermove", onPointerMove);
    scroll.addEventListener("pointerup", onPointerUp);
    scroll.addEventListener("pointercancel", onPointerUp);
    scroll.addEventListener("wheel", onWheel, { passive: false });
    zoomToFit();
  }
  function disableZoom() {
    if (!zoomOn) {
      resetZoom();
      return;
    }
    zoomOn = false;
    scroll.removeEventListener("pointerdown", onPointerDown);
    scroll.removeEventListener("pointermove", onPointerMove);
    scroll.removeEventListener("pointerup", onPointerUp);
    scroll.removeEventListener("pointercancel", onPointerUp);
    scroll.removeEventListener("wheel", onWheel);
    pointers = [];
    resetZoom();
  }
  function setMode(next) {
    if (MODES.indexOf(next) < 0) next = "shrink";
    mode = next;
    html.setAttribute("data-mobile-mode", next);
    try { localStorage.setItem("glitchgen-mobile-mode", next); } catch (e) {}
    document.querySelectorAll("[data-mode-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-mode-btn") === next ? "true" : "false");
    });
    if (next === "zoom") enableZoom();
    else disableZoom();
  }
  document.querySelectorAll("[data-mode-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setMode(btn.getAttribute("data-mode-btn"));
    });
  });
  window.addEventListener("resize", function () {
    if (mode === "zoom") zoomToFit();
  });
  setMode(mode);
})();
</script>`;
}

/**
 * Footer control for the three phone layouts.
 * @returns {string}
 */
export function getMobileModeToggleHtml() {
  return `<div class="gg-mobile-switch" role="group" aria-label="Phone layout">
      <button type="button" data-mode-btn="shrink">Shrink</button>
      <button type="button" data-mode-btn="zoom">Zoom</button>
      <button type="button" data-mode-btn="stack">Stack</button>
    </div>`;
}
