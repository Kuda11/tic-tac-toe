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

    changePlayerTurn()
    
}

function displaySymbol(box, currentClass) {
    box.classList.add(currentClass)
}

function changePlayerTurn() {
    circleTurn = !circleTurn
}