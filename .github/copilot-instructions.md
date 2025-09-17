# Copilot instructions for this repo

Scope: Static, client-only web app (no build/test tooling). All UI, physics logic, and rendering live in `index.html` (and duplicated in `kinematics_calculator.html`). Keep both files in sync when changing shared logic; treat `index.html` as the source of truth.

Big picture
- Modes (radio buttons): `1d`, `basic` (2D), `design` (2D with landing angle), `multiObject1D`.
- Central flow: user input → `calculate()` dispatches per mode → updates Results panel and (except 1D single) draws on `<canvas id="trajectoryCanvas">` and enables animation/slider.
- Rendering: Canvas-based drawing with globals controlling scales/offsets; 2D uses one set of point shapes; Multi-Object 1D uses another. Animation uses a 0–100 slider mapped to time and `requestAnimationFrame` with fixed 3000ms playback.

Key files
- `index.html`: single page app with inline CSS and JS (main entry). IDs and functions below are defined here.
- `kinematics_calculator.html`: duplicate of `index.html`. Mirror changes that alter shared behavior.
- `README.md`: user-facing features, physics background, and modes.

Runtime workflow (dev/use)
- Open `index.html` in a browser to run (no build). Optional: use VS Code Live Server for auto-reload.

Important conventions and contracts
- Units: SI. Angles in UI are degrees; internal calculations convert to radians (`deg * Math.PI/180`).
- Numeric tolerance: `TOLERANCE = 1e-9`. Use it for comparisons; clamp negatives to `0` where time must be non-negative.
- Gravity: `G_DEFAULT = 9.81`. In 2D modes, `#acceleration` is sanitized to a positive number; invalid/≤0 resets to default.
- Messaging: Use `showNote`, `showError`, `showResult` to write into `#message` inside the Results panel; format individual lines with `formatResultLine(label, value, unit)`.
- Debounced inputs: All `input[type=number]` are wired to `calculate` via `debounce(..., 250)`.
- Mode switching: `updateModeVisibility()` toggles input groups, the trajectory panel, gravity box, and graph title (`#graphTitle`). Always call `resetAnimation()` after changing mode.

Global state (must remain consistent)
- 2D: `globalPoints` as array of `{x,y,t}`, `globalScale`, `globalOffsetX/Y`, `global_t_flight`, `globalVix`, `globalViy`, `globalG`, `globalVerticalShift`.
- Multi-Object 1D: `globalPoints` as array of objects `{id,label,color,trajectory: [{t,x}]}`, plus `multiObjectData`, `globalScaleX/Y`, `globalMeetingPoints`, `globalMaxTime`, `globalMinPosition`, `globalMaxPosition`.
- Note: `globalPoints` shape differs by mode; drawing helpers are mode-aware. Avoid cross-mode assumptions in shared helpers.

Rendering pipeline
- 2D: `calculateBasicMode`/`calculateDesignMode` → `prepareAndDrawTrajectory(Vix,Viy,t,g,dyEnd)` computes `globalPoints`, scale, and offsets → `updateAnimationFrame()` draws static path (`drawStaticTrajectory`) and projectile (`drawProjectile`) at slider-derived time → `updateStateDisplay(t)`.
- Multi-Object 1D: `calculateMultiObject1DMode()` computes trajectories and meeting points → `prepareAndDrawMultiObject1DGraph()` draws axes, curves, labels, and red meeting points → `drawMultiObject1DCurrentState(ctx,t)` and `updateStateDisplayMultiObject(t)` for the slider time. Canvas clicks near meeting points set the slider to that time.

Physics patterns and edge cases
- 1D solver supports many combinations and may yield multiple solutions when quadratic; it renders grouped “Solution n” sections instead of a single summary.
- 2D solver handles vertical-launch and “two-angle” cases; when both angle solutions exist, it notes the alternate angle.
- Keep non-physical results guarded (e.g., negative discriminants, negative times) and use `TOLERANCE` to avoid floating-point artifacts.

Styling notes
- Dark mode via `prefers-color-scheme` and CSS variables. Some draw colors are hardcoded in JS (e.g., trajectory `#1e90ff`, projectile fill `blue`, meeting points `red`). Changing those requires JS updates; CSS vars alone won’t affect them.

Extending safely (examples)
- Add an input: create a labeled `<input type=number>` with a stable `id`, read it via `getFloatValue(id, allowEmpty?)`, and include it in the mode’s calculation function; update `showNote` guidance as needed.
- Add a mode: add a radio + label, create a container for inputs, extend `updateModeVisibility`, `calculate` dispatcher, `graphTitle` text, and (if animated) `updateAnimationFrame` and `resetAnimation` branches.
- Add results: append via `formatResultLine(...)` and `showResult(...)` to preserve styling.

Gotchas
- The slider is 0–100, mapped to time; animation duration is fixed (`ANIMATION_DURATION = 3000ms`) regardless of physical time range.
- Gravity box hidden in 1D modes; trajectory panel hidden in single 1D mode.
- Keep `index.html` and `kinematics_calculator.html` synchronized when modifying shared logic.
