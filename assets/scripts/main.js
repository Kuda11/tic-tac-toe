import { checkWin } from "./game-functionality.js";
import { botController } from "./computer-brain.js";
import { requestAds } from "./ads.js";

const X_SYMBOL_CLASS = "x";
const O_SYMBOL_CLASS = "circle";
const DetectWinningText = document.querySelector("[data-user-result-message]");
const DetectDrawText = document.querySelector("[data-user-result-message]");
export const tickBoxes = document.querySelectorAll("[data-box]");
const DisplayStartingText = document.getElementById("userStartGameMessage");
const DisplayWinningText = document.getElementById("userResultMessage");
let circleTurn = randomisePlayerTurn();
const userStartGameBtn = document.getElementById("userStartGameBtn");
const restartBtn = document.getElementById("restartBtn");
const leaveGameBtn = document.getElementById("leaveGameBtn");
const userTurnMessage = document.querySelector("[data-user-turn-message]");
const leaveLink = document.querySelector(".leaveLink");
const gameScreen = document.querySelector(".game-screen");
const mainAdContainer = document.querySelector('.mainAdContainer');

userStartGameBtn.addEventListener("click", userStartGame);
restartBtn.addEventListener("click", restartGame);
let waitTurn = false;

function randomisePlayerTurn() {
  return Math.random() > 0.5 ? true : false;
}

tickBoxes.forEach((box) => {
  box.addEventListener("keydown", handleClick);
});

showWhoIsPlaying();

decideStartingPlayer();

function decideStartingPlayer() {
  const randomNumber = Math.round(Math.random());
  if (randomNumber === 0) {
    runBotController({
      displaySymbol,
      botCharacterClass: !circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS,
      handleClick,
      randomBox: findRandomEmptyBox(),
    });
  }
}

function userStartGame() {
  gameScreen.style.display = "none";
  DisplayStartingText.classList.add("display");
}

function restartGame() {
    // Ads to run after game has finished e.g. you draw, win or lose
    // Need to fix it, so it runs the ads properly
    // Need to be able to hide everything else and cause the div with mainAdContainer to show
    // Need to have it autoplay eventually as well

//   requestAds();

  DisplayWinningText.classList.remove("display");

  waitTurn = false;
  tickBoxes.forEach((box) => {
    box.classList.remove(O_SYMBOL_CLASS);
    box.classList.remove(X_SYMBOL_CLASS);
  });
  showWhoIsPlaying();
  randomisePlayerTurn();
}

document.body.addEventListener('keydown', handleClick)

function handleClick(e) {
  const welcomeScreen = document.querySelector('.user-start-message.display');
  const playAgainScreen = document.querySelector(".user-result-message.display");

  if(!welcomeScreen) {
    if(convertKeyToMovePosition(e.keyCode) === 'enter') {
      userStartGame();
      requestAds();
      return;
    }
    if(convertKeyToMovePosition(e.keyCode) === 'backspace') {
      window.location = leaveLink.href
      return;
    }
  }

  if(playAgainScreen) {
    if(convertKeyToMovePosition(e.keyCode) === 'enter') {
      restartGame();
      requestAds();
      return;
    }
    if(convertKeyToMovePosition(e.keyCode) === 'backspace') {
      window.location = leaveLink.href
      return;
    }
  }
  
  if (waitTurn) return;
    const spotsMarked = {};

    const movePosition = convertKeyToMovePosition(e.keyCode);
    
    const box = document.querySelector('.highlight')
    const currentClass = circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS;

    const spotToMoveTo = movePlayer(box, movePosition)

    if(!spotToMoveTo) return;

    if (e.keyCode === 13) {
      if(!(spotToMoveTo.classList.contains(O_SYMBOL_CLASS) || spotToMoveTo.classList.contains(X_SYMBOL_CLASS))) {
        displaySymbol(spotToMoveTo, currentClass);
      } else {
        return;
      }
    } else {
      return;
    }
  
    // User
  
    showWhoIsPlaying("Computer");
  
    const playerSpotsMarked = [...tickBoxes].filter((tickBox) => {
      return tickBox.classList.contains(currentClass);
    });
  
    spotsMarked["playerSpotsMarked"] = playerSpotsMarked;
  
    if (checkWin(currentClass)) {
      return endGame(false, {
        user: "PLAYER",
      });
    }
  
    if (isDraw()) {
      return endGame(true);
    } else {
      // Bot
      waitTurn = true;
  
      changePlayerTurn();
      const botCharacterClass = circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS;
  
      const botSpotsMarked = [...tickBoxes].filter((tickBox) => {
        return tickBox.classList.contains(botCharacterClass);
      });
  
      spotsMarked["botSpotsMarked"] = botSpotsMarked;
  
      const botGameInfo = {
        spotsMarked,
        currentClass,
        displaySymbol,
        botCharacterClass,
        handleClick,
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
  const currentPositionID = currentPosition.id;
  let spaceToMoveBy = 0;
  switch(desiredMove) {
    case 'up':
      spaceToMoveBy -= 3;
      break;
    case 'right':
      spaceToMoveBy += 1;
      break;
    case 'down':
      spaceToMoveBy += 3;
      break;
    case 'left':
      spaceToMoveBy -= 1;
      break;
  }

  const newPosition = parseInt(currentPositionID) + spaceToMoveBy;
  if(newPosition < 0 || newPosition > 8) {
    return true;
  } 
  const newSpot = document.getElementById(newPosition);

  currentPosition.classList.remove('highlight');
  newSpot.classList.add('highlight');
  return newSpot
}