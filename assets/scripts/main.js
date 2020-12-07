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
const userTurnMessage = document.querySelector("[data-user-turn-message]");
const gameScreen = document.querySelector(".game-screen");

userStartGameBtn.addEventListener("click", userStartGame);
restartBtn.addEventListener("click", restartGame);
let waitTurn = false;

function randomisePlayerTurn() {
  return Math.random() > 0.5 ? true : false;
}

tickBoxes.forEach((box) => {
  box.addEventListener("click", handleClick);
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
    box.addEventListener("click", handleClick);
    showWhoIsPlaying();
    randomisePlayerTurn();
  });
}

function handleClick(e) {
  if (waitTurn) return;
  e.target.removeEventListener("click", handleClick);
  const spotsMarked = {};

  const box = e.target;
  const currentClass = circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS;

  // User
  displaySymbol(box, currentClass);

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
