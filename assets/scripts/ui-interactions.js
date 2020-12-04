const X_SYMBOL_CLASS = 'x'
const Y_SYMBOL_CLASS = 'circle'
const tickBoxes = document.querySelectorAll('[data-box]')

tickBoxes.forEach(box => {
    box.addEventListener('click', handleClick, { once: true }) 
})

function handleClick(e) {
    const box = e.target
    const currentClass = circleTurn ? Y_SYMBOL_CLASS : X_SYMBOL_CLASS

    displaySymbol(box, currentClass)
}

function displaySymbol(box, currentClass) {
    box.classList.add(currentClass)
}