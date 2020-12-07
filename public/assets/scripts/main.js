import { checkWin } from "./game-functionality.js";
import { botController } from "./computer-brain.js";
import { requestAds } from "./ads.js";

export const tickBoxes = document.querySelectorAll("[data-box]");
const X_SYMBOL_CLASS = "x";
const O_SYMBOL_CLASS = "circle";
const DetectWinningText = document.querySelector("[data-user-result-message]");
const DetectDrawText = document.querySelector("[data-user-result-message]");
const DisplayStartingText = document.getElementById("userStartGameMessage");
const DisplayWinningText = document.getElementById("userResultMessage");
const userTurnMessage = document.querySelector("[data-user-turn-message]");
const leaveLink = document.querySelector(".leaveLink");
const gameScreen = document.querySelector(".game-screen");

let circleTurn = randomisePlayerTurn();
let waitTurn = false;

document.body.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
  const welcomeScreen = document.querySelector('.user-start-message.display');
  const playAgainScreen = document.querySelector(".user-result-message.display");

  if(!welcomeScreen) {
    decideStartingPlayer();
    showWhoIsPlaying();
    return playOrEscape(userStartGame, e.keyCode)
  }

  if(playAgainScreen) {
    return playOrEscape(restartGame, e.keyCode)
  }
  
  if (waitTurn) return;

  const currentClass = circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS;
  const spotsMarked = {};

  const movePosition = convertKeyToMovePosition(e.keyCode);
  
  const box = document.querySelector('.highlight')

  const spotToMoveTo = movePlayer(box, movePosition)

  if(!spotToMoveTo) return;

  // Player
  if (e.keyCode === 13 && !(spotToMoveTo.classList.contains(O_SYMBOL_CLASS) || spotToMoveTo.classList.contains(X_SYMBOL_CLASS))) {
    displaySymbol(spotToMoveTo, currentClass);
    showWhoIsPlaying("Computer");
  } else {
    return;
  }

  if (checkWin(currentClass)) {
    return endGame(false, {
      user: "PLAYER",
    });
  }

  if (isDraw()) {
    return endGame(true);
  } 
    // Bot
  waitTurn = true;

  // Invert boolean value of circle turn
  changePlayerTurn();

  const botCharacterClass = circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS;

  // Record player's positions on game board
  const playerSpotsMarked = [...tickBoxes].filter((tickBox) => {
    return tickBox.classList.contains(currentClass);
  });

  spotsMarked["playerSpotsMarked"] = playerSpotsMarked;

  // Record computer's positions on game board
  const botSpotsMarked = [...tickBoxes].filter((tickBox) => {
    return tickBox.classList.contains(botCharacterClass);
  });

  spotsMarked["botSpotsMarked"] = botSpotsMarked;

  const botGameInfo = {
    spotsMarked,
    currentClass,
    displaySymbol,
    botCharacterClass,
    handleKeyDown,
    randomBox: findRandomEmptyBox(),
  };

  const delayBot = setTimeout(() => {
    runBotController(botGameInfo);
    showWhoIsPlaying();
    clearInterval(delayBot);

    if (checkWin(botCharacterClass)) {
      return endGame(false, {
        user: "COMPUTER",
      });
    } else {
      waitTurn = false;
    }
  }, 1000);

  changePlayerTurn();
}

function randomisePlayerTurn() {
  return Math.random() > 0.5 ? true : false;
}

function displaySymbol(box, currentClass) {
  box.classList.add(currentClass);
}

function changePlayerTurn() {
  circleTurn = !circleTurn;
}

function endGame(draw, winner = null) {
  if (draw) {
    DetectDrawText.innerText = "Draw";
  } else {
    DetectWinningText.innerText = `${winner.user} Wins`;
  }
  DisplayWinningText.classList.add("display");
}

function isDraw() {
  return [...tickBoxes].every((box) => {
    return (
      box.classList.contains(O_SYMBOL_CLASS) ||
      box.classList.contains(X_SYMBOL_CLASS)
    );
  });
}

function showWhoIsPlaying(userTurn = "Your") {
  userTurnMessage.innerHTML = `${userTurn} Turn`;
}

function findRandomEmptyBox() {
  const boxesLeft = [...tickBoxes].filter((tickBox) => {
    return !(
      tickBox.classList.contains(O_SYMBOL_CLASS) ||
      tickBox.classList.contains(X_SYMBOL_CLASS)
    );
  });

  const boxIds = boxesLeft.map((box) => {
    return {
      element: box,
      id: box.id,
    };
  });

  return boxIds[Math.floor(Math.random() * boxesLeft.length)];
}

function runBotController(botGameInfo) {
  botController(botGameInfo);
}

function convertKeyToMovePosition(keyCode) {
  switch(keyCode) {
    case 37:
      return 'left';
    case 38:
      return 'up';
    case 39:
      return 'right';
    case 40:
      return 'down';
    case 13:
      return 'enter';
    case 8:
      return 'backspace';
  }
}

function movePlayer(currentPosition, desiredMove) {
  let newPosition = parseInt(currentPosition.id);
  switch(desiredMove) {
    case 'up':
      newPosition -= 3;
      break;
    case 'right':
      newPosition += 1;
      break;
    case 'down':
      newPosition += 3;
      break;
    case 'left':
      newPosition -= 1;
      break;
  }

  const newSpot = document.getElementById(newPosition);

  if(newSpot) {
    currentPosition.classList.remove('highlight');
    newSpot.classList.add('highlight');
    return newSpot
  }
}

function decideStartingPlayer() {
  const randomNumber = Math.round(Math.random());
  if (randomNumber === 0) {
    runBotController({
      displaySymbol,
      botCharacterClass: !circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS,
      handleKeyDown,
      randomBox: findRandomEmptyBox(),
    });
  }
}

function userStartGame() {
  gameScreen.style.display = "none";
  DisplayStartingText.classList.add("display");
  requestAds();
}

function restartGame() {
  DisplayWinningText.classList.remove("display");

  waitTurn = false;
  tickBoxes.forEach((box) => {
    box.classList.remove(O_SYMBOL_CLASS);
    box.classList.remove(X_SYMBOL_CLASS);
  });
  showWhoIsPlaying();
  randomisePlayerTurn();
}

function playOrEscape(play, keyCode) {
  if(convertKeyToMovePosition(keyCode) === 'enter') {
    play();
    return;
  }
  if(convertKeyToMovePosition(keyCode) === 'backspace') {
    window.location = leaveLink.href;
    return;
  }
}