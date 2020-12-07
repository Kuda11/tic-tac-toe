import { winningComboData } from "./data.js";

const state = {
  player: "",
  displayCounterComputerSymbol: undefined,
  botCharacterClass: "",
  handleClick: undefined,
};

export function botController({
  spotsMarked = {
    playerSpotsMarked: [],
    botSpotsMarked: []
  },
  currentClass,
  displaySymbol,
  botCharacterClass,
  handleClick,
  randomBox
  } = {}
) {
  state.player = currentClass;
  state.botCharacterClass = botCharacterClass;
  state.displayCounterComputerSymbol = displaySymbol;
  state.handleClick = handleClick;

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
  // Security check. Tells us if a combination has been found
  if (spotsMarked.length >= 2) {
    let combinationFound = false;
    // Loop through each position and find each possible permutation for a combination
    // E.g. for an array of [1,3,5]
    // Check for combination of [1,3] [1,5] [3,5]
    for (let i = 0, length = spotsMarked.length; i < length; i++) {
      for (let j = i; j < length - 1; j++) {
        // If a combination has been found, break out the loop
        if (combinationFound) break;
        const combination = [spotsMarked[i], spotsMarked[j + 1]];
        if (checkCombination(combination)) {
          // Lets us know a combination has been found
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
  box.removeEventListener("click", state.handleClick);
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
      emptyPositionOnGameBoard.removeEventListener("click", state.handleClick);
      state.displayCounterComputerSymbol(
        emptyPositionOnGameBoard,
        state.botCharacterClass
      );
      return true;
    }
  }
}

function checkEmptyPositions(playerWinnerCombo) {
  // Box has not been filled yet
  return playerWinnerCombo.some(
    (singlePosition) =>
      document.getElementById(singlePosition).className === "tick-box"
  );
}
