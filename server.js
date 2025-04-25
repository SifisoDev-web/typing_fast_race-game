const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const paragraphText = 'Sifiso is truly passionate about coding and strives to be the best at it.  His commitment to becoming an expert in the field is unmatched, as he believes in the power of consistent practice.'

app.use(express.static("public"));

let players = {};         // { socketId: { name, role } }
let gameStarted = false;
let host = null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chooseRole", ({ name, role }) => {
    if (gameStarted) {
      socket.emit("playerLeft", "Game in progress. Please wait.");
      return;
    }

    // If the first player connects, they are the host
    if (role === "host" && !host) {
      host = socket.id;
      players[socket.id] = { name, role };
      socket.emit("startGame", {
        text: paragraphText,
        opponent: "Waiting for opponent..."
      });
    } else if (role === "join" && host) {
      // If a second player joins, they are the "join" role
      players[socket.id] = { name, role };
      gameStarted = true;
      // Start the game for both players (host and join)
      io.to(host).emit("startGame", {
        text: paragraphText,
        opponent: name
      });
      io.to(socket.id).emit("startGame", {
        text: paragraphText,
        opponent: players[host].name
      });
    } else {
      // If host is already assigned, and the second player tries to join
      socket.emit("playerLeft", "Cannot join. Host already assigned.");
    }
  });

  socket.on("progress", (percent) => {
    socket.broadcast.emit("updateProgress", { id: socket.id, percent });
  });

  socket.on("winner", (name) => {
    io.emit("announceWinner", name);
    resetGame(); // Reset everything
  });

  socket.on("disconnect", () => {
    const player = players[socket.id];
    if (player) {
      const name = player.name || "A player";
      socket.broadcast.emit("playerLeft", name);
    }
    resetGame(); // Always reset if someone disconnects
  });

  function resetGame() {
    players = {};
    gameStarted = false;
    host = null; // Reset host when game is reset
  }
});

server.listen(3000, () => console.log("Server running at http://localhost:3000"));
