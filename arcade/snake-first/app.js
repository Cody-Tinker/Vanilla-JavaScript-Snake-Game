// REQUIRED OBJECTIVES

// start the game using a start button
// use arrow keys to change the direction of the snake
// snake grows 1 unit after eating food
// game ends if snake runs into itself
// game ends if snake hits wall
// track score (length of snake)
// restart button that doesnt refresh browser

// EXTRA OBJ

// high score tracker
// difficulty selector (snake speed)

let lastRenderTime = 0
const gameBoard = document.getElementById("game-board")
const gridSize = 21
let gameOver = false

///////////////////
// GAME INTERVAL //
///////////////////
function game(currentTime) {
  if (gameOver && currentScore > 1) {
    alert("You lose!")
  }
  window.requestAnimationFrame(game)
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
  if (secondsSinceLastRender < 1 / snakeSpeed) return

  lastRenderTime = currentTime

  gameStart()

  updateSnake()
  drawSnake(gameBoard)

  drawFood(gameBoard)
  updateFood()

  checkDeath()
}

window.requestAnimationFrame(game)

function gameStart() {
  const startText = document.getElementById("start")
}

/////////////
// SCORING //
/////////////

const currentScoreText = document.getElementById("score")
const highScoreText = document.getElementById("high-score")

let currentScore = 0
let highScore = 0

///////////////////////
// SNAKE OBJECT CODE //
///////////////////////

const snakeSpeed = 10
const snakeBody = [{ x: 11, y: 11 }] // center of our css grid
let newSegments = 0

// Making the snake responsive to user input //
function updateSnake() {
  const inputDirection = getInputDirection()
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] }
  }

  snakeBody[0].x += inputDirection.x
  snakeBody[0].y += inputDirection.y

  addSegments()
}

// User Input Function //

let inputDirection = { x: 0, y: 0 }
let lastInputDirection = { x: 0, y: 0 }

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (lastInputDirection.y != 0) break
      inputDirection = { x: 0, y: -1 }
      break
    case "ArrowDown":
      if (lastInputDirection.y != 0) break
      inputDirection = { x: 0, y: 1 }
      break
    case "ArrowLeft":
      if (lastInputDirection.x != 0) break
      inputDirection = { x: -1, y: 0 }
      break
    case "ArrowRight":
      if (lastInputDirection.x != 0) break
      inputDirection = { x: 1, y: 0 }
      break
  }
})

function getInputDirection() {
  lastInputDirection = inputDirection
  return inputDirection
}

// Drawing the snake object //

function drawSnake(gameBoard) {
  gameBoard.innerHTML = ""
  snakeBody.forEach((segment) => {
    const snakeElement = document.createElement("div")
    snakeElement.style.gridRowStart = segment.y
    snakeElement.style.gridColumnStart = segment.x
    snakeElement.classList.add("snake")
    gameBoard.appendChild(snakeElement)
  })
}

function expandSnake(amount) {
  newSegments += amount
}

function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false
    return equalPositions(segment, position)
  })
}

function equalPositions(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody[snakeBody.length] = { ...snakeBody[snakeBody.length - 1] }
  }

  newSegments = 0
}

//////////////////////
// FOOD OBJECT CODE //
//////////////////////

let food = randomFoodPosition()
const extendRate = 1

function drawFood() {
  const foodElement = document.createElement("div")
  foodElement.style.gridRowStart = food.y
  foodElement.style.gridColumnStart = food.x
  foodElement.classList.add("food")
  gameBoard.appendChild(foodElement)
}

function updateFood() {
  if (onSnake(food)) {
    expandSnake(extendRate)
    food = randomFoodPosition()
    currentScore++
    currentScoreText.textContent = "Score: " + currentScore
  }
}

function randomFoodPosition() {
  let newFoodPosition
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = randomGridPosition()
  }
  return newFoodPosition
}

function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  }
}

/////////////////////
// LOSE GAME CODE //
///////////////////

function checkDeath() {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}

function outsideGrid(position) {
  return (
    position.x < 1 ||
    position.x > gridSize ||
    position.y < 1 ||
    position.y > gridSize
  )
}

function getSnakeHead() {
  return snakeBody[0]
}

function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true })
}
