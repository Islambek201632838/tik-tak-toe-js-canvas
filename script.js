const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const leaderBoard = []
let cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const changePlayerButton = document.getElementById('changePlayerButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let playerName1
let playerName2
const form = document.getElementById('form')
const tableBody = document.getElementById('tableBody')
const rating = document.getElementById('leader-board')
let dimension = 0;

let circleTurn



let start = false

form.addEventListener('submit', function(event) {
    event.preventDefault()
    playerName1 = document.getElementById('input-player1').value
    playerName2 = document.getElementById('input-player2').value
    form.classList.add('hidden')
    board.classList.remove('hidden')
    dimension = +document.getElementById('dimension').value
    startGame()
})

board.classList.add('hidden')

restartButton.addEventListener('click', function() {
  startGame()
  board.classList.remove('hidden')
} )

changePlayerButton.addEventListener('click', function() {
  startGame()
  form.classList.remove('hidden')
  board.classList.add('hidden')
  playerName1 = ''
  playerName2 = ''

});

function generateCells(dimension) {
  if (dimension > 0 && Number.isInteger(dimension)) {
    board.innerHTML = "";
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        const cellContainer = document.createElement("div");
        cellContainer.classList.add("cell");
        cellContainer.setAttribute('data-cell', '');
        board.appendChild(cellContainer);
      }
    }
    board.style = `grid-template-columns: repeat(${dimension}, auto)`;
    cellElements = document.querySelectorAll('[data-cell]');
  } else {

    alert("Please enter a valid positive integer for the dimension.");
  }
}

function startGame() {
  circleTurn = false
  generateCells(dimension)
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS)
    cell.classList.remove(CIRCLE_CLASS)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true });
  })

  setBoardHoverClass()
  winningMessageElement.classList.remove('show')

}

function handleClick(e) {
  const cell = e.target
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
  placeMark(cell, currentClass)
  if (checkWin(currentClass)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    swapTurns()
    setBoardHoverClass()
  }
}
function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Ничья!';
  } else {
    let canvas = document.createElement("canvas");
    let container = document.querySelector('#confetti');

    createConfetti(container, canvas); // Pass container and canvas as arguments
    
    winningMessageTextElement.classList.add('win-animation');
    const soundEffect = new Audio('assets/win-sound.mp3');
    soundEffect.play();
    
    createLeaderBoard(circleTurn);
                     
  }
  winningMessageElement.classList.add('show');
}


function createConfetti(container, canvas) {
  canvas.width = 600;
  canvas.height = 600;
  container.appendChild(canvas);

  let confetti_button = confetti.create(canvas);
  confetti_button({
    particleCount: 200,
    spread: 200,
    startVelocity: 15,
    scalar: 0.9,
    ticks: 90
  }).then(() => container.removeChild(canvas));
  
}


function createLeaderBoard(circleTurn) {
  let winner = circleTurn ? playerName2 : playerName1;
  winningMessageTextElement.innerText = `${winner} Выграл!`;
  const playerIndex = leaderBoard.findIndex(item => item.player === winner);
  if (playerIndex !== -1) {
    leaderBoard[playerIndex].victories++;
  } else {
    leaderBoard.push({
      'player': winner,
      'victories': 1
    });
  }
  if(leaderBoard.length==0) {
    rating.classList.add('hidden')
  }
  else {

    leaderBoard.sort((a, b) => b.victories - a.victories);
    tableBody.innerHTML = '';
    leaderBoard.forEach((item, index) => {
      tableBody.innerHTML += 
        `<tr>
          <td>${index+1}</td>
          <td>${item['player']}</td>
          <td>${item['victories']}</td>
        </tr>`;
    })
  }
}


function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
  })
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}

function swapTurns() {
  circleTurn = !circleTurn
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(CIRCLE_CLASS)
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

function checkWin(currentClass) {
  const WINNING_COMBINATIONS = generateWinningCombinations(dimension)
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}

function generateWinningCombinations(boardSize) {
  const combinations = [];
  
  // Horizontal combinations
  for (let i = 0; i < boardSize; i++) {
    const combination = [];
    for (let j = 0; j < boardSize; j++) {
      combination.push(i * boardSize + j);
    }
    combinations.push(combination);
  }

  // Vertical combinations
  for (let i = 0; i < boardSize; i++) {
    const combination = [];
    for (let j = 0; j < boardSize; j++) {
      combination.push(j * boardSize + i);
    }
    combinations.push(combination);
  }

  // Diagonal combinations
  const diagonal1 = [];
  const diagonal2 = [];
  for (let i = 0; i < boardSize; i++) {
    diagonal1.push(i * (boardSize + 1));
    diagonal2.push((i + 1) * (boardSize - 1));
  }
  combinations.push(diagonal1, diagonal2);

  return combinations;
}