# Kinematics & Projectile Motion Calculator

A comprehensive web-based calculator for one-dimensional (1D) and two-dimensional (2D) kinematics, including projectile motion analysis. This interactive tool helps users solve physics problems by calculating unknown variables and visualizing projectile trajectories.

## Features

* **Multiple Calculation Modes:**
    * **1D Kinematics:** Solve for any two unknown variables ($V_i$, $V_f$, $a$, $d$, $t$) when three are provided.
    * **2D Projectile Motion (Basic):** Calculate one unknown variable (Initial Velocity $V_i$, Horizontal Displacement $\Delta x$, Vertical Displacement $\Delta y$, or Launch Angle $\theta$) when three others are provided.
    * **2D Projectile Motion (Design):** Determine the required launch angle and initial velocity to hit a target displacement ($\Delta x$, $\Delta y$) with a specific landing angle ($\phi$).
* **Customizable Gravity:** Adjust the gravitational acceleration ($g$) for 2D calculations.
* **Real-time Trajectory Visualization:** For 2D modes, a canvas displays the projectile's path, including start, peak, and landing markers.
* **Interactive Trajectory Playback:** A slider allows users to scrub through the projectile's trajectory, and "Start/Stop" and "Reset" buttons control an animation of the projectile's motion.
* **Live State Display:** During trajectory playback, real-time values for time, horizontal/vertical displacement, horizontal/vertical velocity, speed, and current angle are shown.
* **Responsive Design:** The layout adjusts to different screen sizes for optimal usability on various devices.
* **Dark Mode Support:** Automatically adapts to the user's system dark mode preference.

## How to Use

1.  **Open `kinematics_calculator.html` in your web browser.**
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

## Technical Details

This project is a single HTML file containing all the necessary CSS and JavaScript.

* **HTML5:** Structures the calculator's interface and input fields.
* **CSS3:** Provides styling for a clean, modern, and responsive user interface, including light and dark mode support.
* **JavaScript (ES6+):** Implements all the physics calculations, dynamic UI updates, canvas drawing for trajectory visualization, and animation logic.

### Physics Equations Used

The calculator implements standard kinematic equations:

#### 1D Kinematics:
* $V_f = V_i + at$
* $d = V_i t + \frac{1}{2}at^2$
* $V_f^2 = V_i^2 + 2ad$
* $d = \frac{1}{2}(V_i + V_f)t$

#### 2D Projectile Motion (Horizontal and Vertical components are treated separately):
* **Horizontal Motion (constant velocity):**
    * $\Delta x = V_{ix} t$
    * $V_{fx} = V_{ix}$
* **Vertical Motion (constant acceleration due to gravity):**
    * $V_{fy} = V_{iy} - gt$
    * $\Delta y = V_{iy} t - \frac{1}{2}gt^2$
    * $V_{fy}^2 = V_{iy}^2 - 2g\Delta y$
* **Component Resolution:**
    * $V_{ix} = V_i \cos(\theta)$
    * $V_{iy} = V_i \sin(\theta)$
* **Design Mode Specific Equations (derived from the above):**
    * $\tan(\theta) = \frac{2\Delta y}{\Delta x} - \tan(\phi)$
    * $V_i^2 = \frac{g \Delta x^2}{2 \cos^2(\theta) (\Delta x \tan(\theta) - \Delta y)}$

Where:
* $V_i$: Initial Velocity
* $V_f$: Final Velocity
* $a$: Acceleration
* $d$: Displacement
* $t$: Time
* $\Delta x$: Horizontal Displacement
* $\Delta y$: Vertical Displacement
* $\theta$: Launch Angle (from horizontal)
* $\phi$: Landing Angle (from horizontal)
* $g$: Gravitational Acceleration

## Development

To run and modify the code:

1.  Clone this repository or download the `kinematics_calculator.html` file.
2.  Open the `kinematics_calculator.html` file in any modern web browser (e.g., Chrome, Firefox, Edge).
3.  Edit the HTML, CSS, or JavaScript directly in your preferred code editor.

## License

This project is open-source and available under the [MIT License](LICENSE).