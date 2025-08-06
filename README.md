# Kinematics & Projectile Motion Calculator

A web-based calculator and visualization tool for analyzing one-dimensional (1D) and two-dimensional (2D) motion, including projectile trajectories and multi-object motion comparisons.

## What's New

- **New Calculation Mode:** **Multi-Object 1D Motion**
  - Enter initial position, velocity, and acceleration for up to **three objects**.
  - Automatically calculates and visualizes position-time graphs.
  - Identifies and lists **meeting points** where objects have the same position at the same time.
- **Improved Trajectory Visualization:**
  - Redesigned layout with a split panel showing both the canvas and real-time state display.
  - Dynamic graph title changes based on the selected mode (1D or 2D).
- **Refined User Interface:**
  - Light and dark mode support with modernized CSS variables.
  - Responsive layout that works well on mobile and desktop devices.
- **Enhanced Physics Handling:**
  - More robust 1D calculation solver that supports multiple solutions where applicable.
  - Extended 2D projectile motion handling with optional time state analysis.
- **Interactive Features:**
  - Toggle Object 3 dynamically in Multi-Object mode.
  - Clickable meeting points on the graph to highlight collisions or interactions.
  - Redesigned animation controls (Start/Stop/Reset) and timeline slider.

## Features

### Modes
- **1D Kinematics:** Solve for unknowns among $V_i$, $V_f$, $a$, $d$, and $t$.
- **2D Projectile Motion:** Solve for one unknown among $V_i$, $\Delta x$, $\Delta y$, and $\theta$.
- **2D Design Mode:** Determine launch angle and initial velocity to hit a target with a given landing angle.
- **Multi-Object 1D:** Compare the motion of up to three objects with different starting conditions.

### Visualization
- **2D Modes:** Trajectory animation with live state display (position, velocity components, speed, and angle).
- **Multi-Object 1D Mode:** Position-time graph with color-coded objects and meeting point markers.

### Interface
- **Responsive design** supporting various screen sizes.
- **Light/Dark mode** automatically applied.
- **Interactive controls** for adding/removing objects, adjusting input parameters, and controlling animations.

## How to Use

1. Open `kinematics_calculator.html` in your web browser.
2. Select a calculation mode:
   - **1D:** Fill in exactly three fields.
   - **2D:** Fill in exactly three of $V_i$, $\Delta x$, $\Delta y$, and $\theta$ (optional $t$ for state analysis).
   - **Design:** Fill in target $\Delta x$, $\Delta y$, and landing angle $\phi$.
   - **Multi-Object 1D:** Provide initial position, velocity, and acceleration for at least two objects (optionally three).
3. Adjust gravity for 2D modes if needed.
4. View results in the results panel.
5. Use the trajectory panel to:
   - Scrub through animations with the slider.
   - Start/stop/reset the playback.
   - Click meeting points in Multi-Object mode to view interaction details.

## Technologies

- **HTML5** for structure and canvas rendering.
- **CSS3** with custom properties and dark mode support.
- **JavaScript (ES6+)** for calculations, graphing, animation, and event handling.

## Physics Implemented

### 1D Kinematics
- $V_f = V_i + a t$
- $d = V_i t + \tfrac12 a t^2$
- $V_f^2 = V_i^2 + 2 a d$
- $d = \tfrac12 (V_i + V_f) t$

### 2D Projectile Motion
- Horizontal: $\Delta x = V_{ix} t$
- Vertical: $\Delta y = V_{iy} t - \tfrac12 g t^2$
- Launch angle resolution: $V_{ix} = V_i \cos\theta$, $V_{iy} = V_i \sin\theta$
- Design mode includes derived equations for landing angle constraints.

## License

This project is open-source under the [MIT License](LICENSE).
