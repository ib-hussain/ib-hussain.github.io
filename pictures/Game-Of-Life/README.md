# Conway's Game of Life 🧬

A C++ implementation of **Conway’s Game of Life**, simulating the evolution of cellular automata based on simple rules. This was built as part of my academic development to explore algorithms, grid manipulation, and terminal-based visualisation.
<p align="center">
  <img src="game-of-life.gif" alt="Game of Life" >
</p>
## 📌 What is the Game of Life?

The Game of Life is a zero-player game devised by mathematician **John Conway**. It consists of a grid of cells that evolve over discrete time steps according to a set of rules based on the states of neighbouring cells.

Each cell can be either **alive (1)** or **dead (0)**, and the next generation is determined by:

1. **Underpopulation:** A live cell with fewer than two live neighbours dies.  
2. **Survival:** A live cell with two or three live neighbours lives on.  
3. **Overpopulation:** A live cell with more than three live neighbours dies.  
4. **Reproduction:** A dead cell with exactly three live neighbours becomes alive.

## ⚙️ Features

- Terminal-based grid visualisation  
- Real-time evolution of cells  
- Efficient array-based updates  
- Clean and beginner-friendly C++ structure

## 🔧 How to Run

1. Clone the repository:
   
   git clone https://github.com/ib-hussain/Game-Of-Life.git
   
   cd Game-Of-Life
   
3. Compile the code:
   
   g++ -o game_of_life main.cpp
   
4. Run the simulation:
   
   ./game_of_life
   
Make sure your terminal window is wide enough to display the grid properly.

## 🧠 Learning Objectives
This project helped me explore:

Algorithmic thinking and optimisation

Simulation of dynamic systems

Grid manipulation and neighbour detection logic

User interaction and console rendering

## 💡 Possible Extensions
Load initial patterns from file

Add pause/resume and speed control

Implement toroidal (wrap-around) boundaries

Visualise with a GUI (e.g., using SDL or SFML)

Feel free to fork, modify, or contribute. If you find this project useful or interesting, a ⭐ is appreciated!
