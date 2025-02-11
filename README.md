# **Snooker Table Simulator**

## **Overview**
This project is a **Snooker Table Simulator**, developed using **p5.js and Matter.js**. It allows users to interact with a digital snooker table, place the cue ball in the D-zone, and simulate basic cue ball physics.

## **Features**
- **Realistic Snooker Table Setup**: The game follows conventional snooker table designs.
- **Cue Ball Placement**: Users can place the cue ball in the D-zone and adjust its position before taking a shot.
- **Basic Cue Stick Mechanics**: The force applied to the cue ball is determined by the **distance between the mouse pointer and the cue ball**, with a limit to prevent excessive force.
- **Physics Simulation**: Implemented basic physics for ball movement and cushion interactions using **Matter.js**.
- **Pocket Detection**: Checks when balls enter pockets and updates the game state.
- **Set Up Modes**:
  - **Normal Setup**: Predefined placement of balls.
  - **Random Red Setup**: Red balls are placed in random locations.
  - **Random All-Color Setup**: All colored balls are randomly placed.
- **Strength Meter & Force Line**: Displays shot strength and direction.
- **Game Mechanics**:
  - Users can only take a shot when the cue ball is stationary.
  - A reset function allows replaying the game.

## **Technologies Used**
- **p5.js** – For rendering the snooker table and handling user interactions.
- **Matter.js** – For physics-based interactions and object collisions.
- **JavaScript** – For game logic and mechanics.

## **How It Works**
1. **Select Setup Mode**: Choose between **Normal**, **Random Red**, or **Random All-Color** setups.
2. **Place the Cue Ball**: Move the cue ball within the D-zone and click to confirm placement.
3. **Aim & Shoot**:
   - Move the mouse to adjust the force and direction.
   - Click the left mouse button to take a shot.
4. **Game Progression**:
   - Balls move realistically according to physics.
   - Pocket detection ensures balls disappear upon entering a pocket.
   - Cue ball must be placed back in the D-zone if pocketed.
5. **Restart & Adjustments**:
   - Press `R` to reposition the cue ball.
   - Press `4` to restart the entire game.

## **Example Usage**
### **Basic Gameplay**
1️⃣ Press `1` for Normal Setup, `2` for Random Red Setup, or `3` for Random All-Color Setup.  
2️⃣ Click inside the **D-zone** to place the cue ball.  
3️⃣ Move the mouse to aim and adjust shot power.  
4️⃣ Click the **left mouse button** to shoot the cue ball.  
5️⃣ If the cue ball is pocketed, place it back in the D-zone before the next shot.  

## **Potential Enhancements**
- Improve **collision physics** to make ball behavior more realistic.
- Implement **scoring system** and player turns.
- Add **sound effects** for a more immersive experience.
- Improve **force line visualization** to predict ball movement more accurately.

## **Installation & Setup**
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/snooker-simulator.git
   ```
2. Open `index.html` in your browser to run the project.
3. Modify `sketch.js` to extend functionality as needed.
