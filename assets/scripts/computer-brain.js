import { winningComboData } from "./data.js";

const state = {
  player: "",
  displayCounterComputerSymbol: undefined,
  botCharacterClass: "",
  handleKeyDown: undefined,
};

export function botController({
  spotsMarked = {
    playerSpotsMarked: [],
    botSpotsMarked: [],
  },
  currentClass,
  displaySymbol,
  botCharacterClass,
  handleKeyDown,
  randomBox,
} = {}) {
  state.player = currentClass;
  state.botCharacterClass = botCharacterClass;
  state.displayCounterComputerSymbol = displaySymbol;
  state.handleKeyDown = handleKeyDown;

  if (playToWin(spotsMarked)) {
    return;
  } else if (stopPlayerFromWinning(spotsMarked)) {
    return;
  } else {
    playRandom(randomBox.element);
  }
}

function stopPlayerFromWinning({ playerSpotsMarked }) {
  return decideHowToPlay(playerSpotsMarked);
}

function playToWin({ botSpotsMarked }) {
  return decideHowToPlay(botSpotsMarked);
}

function decideHowToPlay(spotsMarked) {
  if (spotsMarked.length >= 2) {
    let combinationFound = false;

    for (let i = 0, length = spotsMarked.length; i < length; i++) {
      for (let j = i; j < length - 1; j++) {
        if (combinationFound) break;

        const combination = [spotsMarked[i], spotsMarked[j + 1]];
        if (checkCombination(combination)) {
          combinationFound = true;
        }
      }
    }
    return combinationFound;
  }
  return false;
}

function playRandom(box) {
  state.displayCounterComputerSymbol(box, state.botCharacterClass);
  box.removeEventListener("click", state.handleKeyDown);
}

function checkCombination(playerSpots) {
  const playerWinnerCombo = winningComboData.find((winningCombo) => {
    const matchingSpots = playerSpots.filter((playerSpot) =>
      winningCombo.includes(parseInt(playerSpot.id))
    );
    return matchingSpots.length == 2;
  });

  if (playerWinnerCombo && checkEmptyPositions(playerWinnerCombo)) {
    const emptyPosition = playerWinnerCombo.find(
      (position) => document.getElementById(position).className === "tick-box"
    );

    if (emptyPosition >= 0 || emptyPosition < 9) {
      const emptyPositionOnGameBoard = document.getElementById(emptyPosition);
      emptyPositionOnGameBoard.removeEventListener("click", state.handleKeyDown);
      state.displayCounterComputerSymbol(
        emptyPositionOnGameBoard,
        state.botCharacterClass
      );
      return true;
    }
  }
}

function checkEmptyPositions(playerWinnerCombo) {
  return playerWinnerCombo.some(
    (singlePosition) =>
      document.getElementById(singlePosition).className === "tick-box"
  );
}
