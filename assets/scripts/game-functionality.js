import { winningComboData } from './data.js'
import { tickBoxes } from './main.js'

export function checkWin(currentClass) {
  return winningComboData.some(combination => {
      return combination.every(index => {
          return tickBoxes[index].classList.contains(currentClass)
      })
  })
}

