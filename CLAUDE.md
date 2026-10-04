# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static, client-only physics calculator (1D kinematics + 2D projectile motion) deployed via GitHub Pages at https://atreyuartax.github.io/kinematics_calculator. There is no build, package manager, linter, or test suite. All UI, CSS, physics, and canvas rendering are inline in a single file, `index.html`.

## Running

- Open `index.html` directly in a browser, or serve the directory (`python3 -m http.server`) so the service worker registers. A service worker needs `http://localhost`; it won't register from `file://`.
- No automated tests. Check changes by hand in the browser in each affected mode, in both light and dark color schemes and at mobile width (≤768px).

## Files

- `index.html`: the whole app, about 4000 lines. It holds `<style>` (dark mode via `prefers-color-scheme` and CSS variables, plus several `@media` breakpoints), the HTML, a small script that registers the service worker, then the main `<script>`.
- `sw.js`: PWA service worker. HTML is network-first; other same-origin GETs are cache-first. **Bump `VERSION` in `sw.js` whenever you ship a change to cached assets**, or installed PWAs keep serving stale files. Every recent commit bumps it, using the format `YYYY-MM-DD-N`.
- `offline.html`: an old frozen snapshot of the app, used as the service worker's offline fallback. It is far behind `index.html` (no optimizer mode, g = 9.81). Don't sync logic into it unless asked.
- `manifest.webmanifest`, `icons/`: PWA metadata. PNG icons must match the sizes in their names. `apple-touch-icon.png` is a full-square (no rounded corners) 180px icon for iOS.
- `.github/copilot-instructions.md`: an older architecture guide. It is mostly accurate, but it predates optimizer mode, still says `G_DEFAULT = 9.81`, and mentions a `kinematics_calculator.html` that no longer exists.

## Architecture (main script in index.html)

**Modes.** There are five mode values, each set by a radio button `input[name="mode"]` and mirrored by a mobile `<select id="modeSelect">`: `1d`, `basic` (2D), `multiObject1D`, `design` (2D with landing angle), and `optimizer` (max-range angle search; compares trajectory A with an optional trajectory B). `handleModeChange()` keeps the radio and the select in sync. `updateModeVisibility()` shows or hides the input groups, the gravity box, the trajectory panel, and the result containers.

**Calculation flow.** Every `input[type=number]` triggers `calculate()`, debounced at 250ms. `calculate()` dispatches to `calculate1DMode`, `calculateBasicMode(g)`, `calculateDesignMode(g)`, `calculateMultiObject1DMode`, or `calculateOptimizerMode`. The 2D modes sanitize `#acceleration` first; a value that is ≤0 or invalid resets to `G_DEFAULT` (9.8). Optimizer inputs also have paired range sliders, wired by `syncInputAndSlider` inside the `DOMContentLoaded` handler.

**Output.** Use `showNote` / `showError` / `showResult` together with `formatResultLine(label, value, unit)` to write to `#message`. Optimizer mode has its own `#optimizerResultContainer` and `#optimizerMessage`.

**Rendering and animation.** Everything draws on one canvas, `#trajectoryCanvas`, through module-level globals. `globalPoints` has a **different shape in each mode**:
- 2D: `{x,y,t}`
- Multi-object: `{id,label,color,trajectory:[{t,x}]}`

The optimizer stores its data in `optimizerAnimationData`. The pipelines are:
- 2D: `prepareAndDrawTrajectory` → `drawStaticTrajectory` + `drawProjectile`
- Multi-object: `prepareAndDrawMultiObject1DGraph` → `drawMultiObject1DCurrentState`
- Optimizer: `prepareAndDrawOptimizer` → `drawOptimizerVisualization` + `drawOptimizerProjectiles`

Drawing code works in logical `CANVAS_WIDTH` × `CANVAS_HEIGHT` (800×400) units, not `canvas.width/height`. `setupHiDPICanvas()` enlarges the pixel buffer by the screen's pixel ratio and scales the context once, so never reset `canvas.width` or call `setTransform` elsewhere. Pointer coordinates must be converted between displayed CSS pixels and logical units (see `handleCanvasClick`). `handleModeChange()` clears `globalPoints` so one mode's data never reaches another mode's drawing code. `updateAnimationFrame()` branches on mode. A 0–100 slider maps to physical time (`global_t_flight` or `globalMaxTime`), and playback always lasts `ANIMATION_DURATION` (3000ms). Call `resetAnimation()` after changing mode.

**Adding a mode** touches all of these: the radio button, the `modeSelect` option, the input container, `updateModeVisibility`, the `calculate` dispatcher, the `updateAnimationFrame` and `resetAnimation` branches, and a clear-button handler (each mode has a `clear*Inputs` function wired up in `DOMContentLoaded`).

## Conventions and gotchas

- SI units. The UI shows angles in degrees and the code computes in radians (`toRadians` / `toDegrees`).
- Use `TOLERANCE = 1e-9` for float comparisons. Guard against negative discriminants and negative times. Quadratic cases in the 1D and 2D solvers can return two solutions, which are rendered as separate "Solution n" blocks or as an "alternate angle" note.
- Some canvas colors are hardcoded in JS (`objectColors`, `optimizerColors`, red meeting points). CSS variables and dark mode don't affect them.
- The README is user-facing. Update it when you change user-visible behavior.
