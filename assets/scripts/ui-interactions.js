import { winningComboData } from './data.js'
const X_SYMBOL_CLASS = 'x'
const O_SYMBOL_CLASS = 'circle'
const tickBoxes = document.querySelectorAll('[data-box]')
let circleTurn

tickBoxes.forEach(box => {
    box.addEventListener('click', handleClick, { once: true }) 
})

function handleClick(e) {
    const box = e.target
    const currentClass = circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS
    displaySymbol(box, currentClass)
    if (checkWin(currentClass)) {
        console.log('winner')
    }
    changePlayerTurn()
    
}

function displaySymbol(box, currentClass) {
    box.classList.add(currentClass)
}

function changePlayerTurn() {
    circleTurn = !circleTurn
}

function checkWin(currentClass) {
    return winningComboData.some(combination => {
        return combination.every(index => {
            return tickBoxes[index].classList.contains(currentClass)
        })
    })
}