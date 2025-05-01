Typing Game
This is a real-time multiplayer typing game built using Node.js, Express, and Socket.io. Players can join as either a host or a joiner, and the game will start when both roles are assigned. The goal is to type the given text as fast and accurately as possible.

🎮 Features
Real-time multiplayer gameplay using Socket.io

Host player starts the game; joiner waits until host is ready

Tracks typing speed and accuracy

Shows opponent’s progress in real-time

First to complete the text wins

Game resets automatically when a player disconnects or refreshes

⚙️ Challenges Faced
1. Socket.io Room Management
Challenge: Game was starting before both players joined, causing sync issues.
Solution: Ensured game only starts when both host and joiner are connected. Added logic for correct role assignment.

2. Role Assignment & Game Flow
Challenge: Incorrect role handling when players joined at different times.
Solution: First player becomes host, second becomes joiner. Game starts only when both are ready.

3. Game State Reset
Challenge: Need to reset game if a player leaves or refreshes.
Solution: Added disconnect listeners to reset state and notify the remaining player.

4. Typing Speed Calculation
Challenge: Smoothly calculating and displaying typing speed with animations.
Solution: Built a function to measure key press intervals and update speed dynamically.

5. Preventing Text Pasting
Challenge: Prevent users from cheating by pasting the text.
Solution: Added an event listener to block paste events in the typing input.

🧩 Installation
Prerequisites
Node.js: Download and install Node.js

npm: Comes with Node.js. Verify with npm -v.

🚀 Steps to Install and Run Locally
bash
Copy
Edit
# Clone the repository
git clone https://github.com/SifisoDev-web/typing_fast_race-game.git
cd typing-game

# Install dependencies
npm install

# Start the server
npm start
Then open your browser and go to:

arduino
Copy
Edit
http://localhost:3000
To test multiplayer, open another tab or browser window.

 
Express – Server framework

Socket.io – Real-time communication

🐞 Known Issues
Browser Compatibility: Works best in modern browsers.

Mobile Support: Layout is not fully optimized for mobile screens.

Network Performance: Lag may occur with poor or distant connections.

 
