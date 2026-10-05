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

**Calculation flow.** Every `input[type=number]` triggers `calculate()`, debounced at 250ms. `calculate()` dispatches to `calculate1DMode`, `calculateBasicMode(g)`, `calculateDesignMode(g)`, `calculateMultiObject1DMode`, or `calculateOptimizerMode`. `calculate()` clears `globalPoints` first, so a failed or incomplete calculation never leaves the previous answer on the graphs. Optimizer inputs also have paired range sliders, wired by `syncInputAndSlider` inside the `DOMContentLoaded` handler.

**Layout.** At 960px and wider, `.wrapper` is a CSS grid for every mode: title across the top, `#inputContainer` then the results card in a left column, and `#trajectoryPanel` sticky in the right column (`.top-container` is `display: contents` so its children join the grid; `--title-height` is set from JS so the panel sits below the sticky title). Below 960px the page is one column in source order: inputs, results, graphs (the optimizer alone puts its results after the graph). Keep the phone order when changing layout; the teacher settled on it.

**Motion graphs.** The graph panel has two views, chosen by the tabs in `.panel-header`: Motion (`#trajectoryCanvas`, the existing animation) and stacked d–t / v–t / a–t graphs (`#dtGraph`, `#vtGraph`, `#atGraph`) on a shared time axis. `effectiveGraphView()` forces graphs in 1D (no animation) and motion in the optimizer (no tabs). `getGraphModel()` turns each mode's solved state into constant-acceleration "tracks" (`x0`, `v0`, `a`): one for 1D (from `oneDGraphSolutions`, with Solution 1/2 tabs when there are two), x and y for 2D/Design, one per object for Multi-Object. `drawMotionGraphs(t)` is called from `updateAnimationFrame()`/`resetAnimation()`, so the slider and Start drive one cursor across all graphs. "Show slope & area" adds tangents on d–t, shaded signed areas on v–t and a–t, and a readout table (`updateGraphReadout`). The graph canvases are drawn in CSS pixels sized by `sizeGraphCanvas()`, unlike the 800×400 logical motion canvas.

**Gravity sign convention.** The `#acceleration` field is the signed vertical acceleration a_y (default `AY_DEFAULT` = −9.8; up is positive). Always read it with `readGravity()`, which returns the magnitude `g` that the solvers use. A positive a_y is shown as an explanatory error, never silently flipped (the teacher's convention: the sign comes from choosing up as positive). Empty input falls back to the default without rewriting the field.

**Output.** Use `showNote` / `showError` / `showResult` together with `formatResultLine(label, value, unit)` to write to `#message`. Optimizer mode has its own `#optimizerResultContainer` and `#optimizerMessage`.

**Rendering and animation.** Everything draws on one canvas, `#trajectoryCanvas`, through module-level globals. `globalPoints` has a **different shape in each mode**:
- 2D: `{x,y,t}`
- Multi-object: `{id,label,color,trajectory:[{t,x}]}`

The optimizer stores its data in `optimizerAnimationData`. The pipelines are:
- 2D: `prepareAndDrawTrajectory` → `drawStaticTrajectory` + `drawProjectile`
- Multi-object: `prepareAndDrawMultiObject1DGraph` → `drawMultiObject1DCurrentState`
- Optimizer: `prepareAndDrawOptimizer` → `drawOptimizerVisualization` + `drawOptimizerProjectiles`

Motion-canvas drawing code works in logical `CANVAS_WIDTH` × `CANVAS_HEIGHT` (800×400) units, not `canvas.width/height`. `setupHiDPICanvas()` enlarges the pixel buffer by the screen's pixel ratio and scales the context once, so never reset `canvas.width` or call `setTransform` elsewhere. Pointer coordinates must be converted between displayed CSS pixels and logical units (see `handleCanvasClick`). Set canvas text with `ctx.font = canvasFont(px)`, which enlarges text when CSS shrinks the canvas (phones). Scale margins or spacing that sit next to text by `canvasTextScale()` (see the optimizer axes and legend). `handleModeChange()` clears `globalPoints` so one mode's data never reaches another mode's drawing code. `updateAnimationFrame()` branches on mode. A 0–100 slider maps to physical time (`global_t_flight` or `globalMaxTime`), and playback always lasts `ANIMATION_DURATION` (3000ms). Call `resetAnimation()` after changing mode.

**Solution steps.** `build1DSteps` / `build2DSteps` / `buildMultiObjectSteps` generate a collapsible "Show solution steps" walkthrough from the user's inputs, independently of the solvers. They are appended via `solutionStepsHTML()`, which swallows errors so steps can never break a result. Notation follows the class: lowercase v, Δd (Δd<sub>x</sub>/Δd<sub>y</sub> in 2D), t (not Δt), and Big 5 equations numbered 1–5 (each leaves out d, a, v_f, v_i, t respectively; `EQ_WITHOUT`). Answer lines carry `data-var`/`data-value` so the steps' numbers can be checked against the Results panel. Plain HTML/CSS math only (`frac`, `sqrtOf`), no KaTeX, so it works offline.

**Adding a mode** touches all of these: the radio button, the `modeSelect` option, the input container, `updateModeVisibility`, the `calculate` dispatcher, the `updateAnimationFrame` and `resetAnimation` branches, and a clear-button handler (each mode has a `clear*Inputs` function wired up in `DOMContentLoaded`).

## Conventions and gotchas

- SI units. The UI shows angles in degrees and the code computes in radians (`toRadians` / `toDegrees`). Display labels use lowercase v and Δd notation.
- Use `TOLERANCE = 1e-9` for float comparisons. Guard against negative discriminants and negative times. Quadratic cases in the 1D and 2D solvers can return two solutions, which are rendered as separate "Solution n" blocks or as an "alternate angle" note.
- Some canvas colors are hardcoded in JS (`objectColors`, `optimizerColors`, red meeting points). CSS variables and dark mode don't affect them.
- Results rows come from `formatResultLine` and are styled as label-left / value-right rows with dividers (`.result p`). Keep new result output on that helper so every mode looks the same.
- The README is user-facing. Update it when you change user-visible behavior.
