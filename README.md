# Kinematics & Projectile Motion Calculator

A comprehensive web-based calculator for one-dimensional (1D) and two-dimensional (2D) kinematics, including projectile motion analysis. This interactive tool helps users solve physics problems by calculating unknown variables and visualizing projectile trajectories.

🔗 https://atreyuartax.github.io/kinematics_calculator

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

1.  **Open https://github.com/AtreyuArtax/kinematics_calculator**
2.  **Select a Mode:**
    * **1D:** For one-dimensional motion. Fill in *exactly three* of the five fields ($V_i$, $V_f$, $a$, $d$, $t$).
    * **2D:** For basic two-dimensional projectile motion. Fill in *exactly three* of $V_i$, $\Delta x$, $\Delta y$, and $\theta$. Time ($t$) is optional for additional state calculation.
    * **Design:** For advanced 2D projectile motion. Fill in target $\Delta x$, $\Delta y$, and the desired landing angle $\phi$.
3.  **Adjust Gravity (2D Modes):** Modify the "Gravitational Accel., g" field if needed (default is 9.81 m/s²).
4.  **View Results:** As you input values, the "Results" panel will automatically update with the calculated unknowns and a summary of the trajectory (for 2D modes).
5.  **Explore Trajectory (2D Modes):**
    * The "Trajectory Visualization" panel will appear.
    * Use the **slider** to manually scrub through the projectile's path.
    * Click **"Start"** to play the animation. The button will change to "Stop".
    * Click **"Stop"** to pause the animation.
    * Click **"Reset"** to return the projectile to its starting position and reset the slider.
    * The "Current State" display will show the projectile's kinematics at the current point in the animation.

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
