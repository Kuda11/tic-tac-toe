import { checkWin } from './game-functionality.js'

const X_SYMBOL_CLASS = 'x'
const O_SYMBOL_CLASS = 'circle'
const DetectWinningText = document.querySelector('[data-user-result-message]')
const DetectDrawText = document.querySelector('[data-user-result-message]')
export const tickBoxes = document.querySelectorAll('[data-box]')
const DisplayWinningText = document.getElementById('userResultMessage')
let circleTurn = randomisePlayerTurn()
const restartBtn = document.getElementById('restartBtn')
restartBtn.addEventListener('click', restartGame)

function randomisePlayerTurn() {
    return Math.random() > 0.5 ? true : false;
}

tickBoxes.forEach(box => {
    box.addEventListener('click', handleClick, { once: true }) 
})

function restartGame() {
    DisplayWinningText.classList.remove('display')
    tickBoxes.forEach(box => {
    box.classList.remove(O_SYMBOL_CLASS)
    box.classList.remove(X_SYMBOL_CLASS)
    box.addEventListener('click', handleClick, { once: true })
    randomisePlayerTurn();
    })
}

function handleClick(e) {
    const box = e.target;
    const currentClass = circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS;

    // You
    displaySymbol(box, currentClass)

    // Bot
    const boxesLeft = [...tickBoxes].filter(tickBox => {
        return !(tickBox.classList.contains(O_SYMBOL_CLASS) || tickBox.classList.contains(X_SYMBOL_CLASS))
    });

    const boxIds = boxesLeft.map(box => {
        return {
            // box is equal to document.getElementById(box)
            element: box,
            id: box.id
        }
    })

    if (checkWin(currentClass)) {
        return endGame(false, currentClass)
    }

    if (boxesLeft.length) {
        changePlayerTurn()
        const botClass = circleTurn ? O_SYMBOL_CLASS : X_SYMBOL_CLASS;
        const randomBox = boxIds[Math.floor(Math.random() * boxesLeft.length)];
        randomBox.element.removeEventListener('click', handleClick, { once: true })
        displaySymbol(randomBox.element, botClass);

        if(checkWin(botClass)) {
            return endGame(false, botClass)
        }
    }

    if (isDraw()){
        endGame(true)
    } else {
        changePlayerTurn()   
    }
}

function displaySymbol(box, currentClass) {
    box.classList.add(currentClass)
}

function changePlayerTurn() {
    circleTurn = !circleTurn
}

function endGame(draw, winner=null) {
    if (draw) {
        DetectDrawText.innerText = "Draw"
    } else {
        DetectWinningText.innerText = `${winner === X_SYMBOL_CLASS ? "X's" : "O's"} Win`
    }
    DisplayWinningText.classList.add('display')
}

function isDraw() {
    return [...tickBoxes].every(box => {
        return box.classList.contains(O_SYMBOL_CLASS) ||
        box.classList.contains(X_SYMBOL_CLASS)
    })
}