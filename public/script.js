const socket = io();
let targetText = "";
let role = "";
let alreadyHandledLeave = false;

function chooseRole(selectedRole) {
  const name = document.getElementById("nameInput").value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  role = selectedRole;
  socket.emit("chooseRole", { name, role });

  document.getElementById("hostJoinSelection").style.display = "none";
  document.getElementById("waiting").style.display = "block";
}
// Game Start
socket.on("startGame", ({ text, opponent }) => {
  targetText = text;
  document.getElementById("textDisplay").innerText = text;
  document.getElementById("game").style.display = "block";
  document.getElementById("waiting").style.display = "none";
  document.getElementById("opponentName").innerText = "Opponent: " + opponent;
});

// Opponent progress
socket.on("updateProgress", ({ percent }) => {
  document.getElementById("opponentProgress").style.width = percent + "%";
});

// Win event
socket.on("announceWinner", (name) => {
  if (name !== "You") alert(name + " wins!");
});

// Opponent left
socket.on("playerLeft", (playerName) => {
  if (!alreadyHandledLeave) {
    alreadyHandledLeave = true;
    alert(`${playerName} has left or refreshed the page. Game will reset.`);
    window.location.reload();
  }
});

// Speed needle setup
const maxSpeed = 1000;
const needle = document.getElementById("needle");
const speedDisplay = document.getElementById("speedDisplay");

function updateSpeed(currentSpeed) {
  const speed = Math.min(Math.max(currentSpeed, 0), maxSpeed);
  const angle = (speed / maxSpeed) * 180 - 90; // Map to -90° to +90°
  needle.style.transform = `rotate(${angle}deg)`;
  speedDisplay.textContent = speed;
}

let startTime = null;
let lastCorrectTime = null;

// Typing logic
document.getElementById("inputArea").addEventListener("input", (e) => {
  const typed = e.target.value;

  if (!startTime && typed.length > 0) {
    startTime = Date.now();
    lastCorrectTime = Date.now();
  }

  let correctCount = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === targetText[i]) {
      correctCount++;
    } else {
      break;
    }
  }

  updateHighlightedText(typed);

  // Trim on incorrect char
  if (typed[correctCount] && typed[correctCount] !== targetText[correctCount]) {
    setTimeout(() => {
      e.target.value = typed.substring(0, correctCount);
      updateHighlightedText(e.target.value);
    }, 50);
    return;
  }

  // Progress update
  const percent = Math.floor((correctCount / targetText.length) * 100);
  document.getElementById("myProgress").style.width = percent + "%";
  socket.emit("progress", percent);

  // Speed update
  if (correctCount > 0) {
    const now = Date.now();
    const reactionTime = now - lastCorrectTime;
    lastCorrectTime = now;

    const speedScore = Math.max(0, 500 - reactionTime);
    updateSpeed(speedScore); // Updates needle and display
  }

  if (typed === targetText) {
    socket.emit("winner", "You");
    alert("🎉 You win!");
  }
});

// Prevent pasting
document.getElementById("inputArea").addEventListener("paste", (e) => {
  e.preventDefault();
});

// Highlight correct characters
function updateHighlightedText(typed) {
  let result = "";
  for (let i = 0; i < targetText.length; i++) {
    const targetChar = targetText[i];
    const typedChar = typed[i];

    if (typedChar == null) {
      result += `<span>${targetChar}</span>`;
    } else if (typedChar === targetChar) {
      result += `<span style="color: green;">${typedChar}</span>`;
    } else {
      result += `<span style="color: red;">${typedChar}</span>`;
    }
  }
  document.getElementById("highlightedText").innerHTML = result;
}

// Cleanup
window.onbeforeunload = () => {
  socket.disconnect();
};
