
// ***************** STATE *****************
let state = {};

//Set game state
const resetState = () => {
  state.board = [];
  //Create 7 arrays each containing 6 'circle's
  for (let i = 0; i < 6; i++) {
    state.board.push(['circle' , 'circle' , 'circle' , 'circle' , 'circle' , 'circle' , 'circle']);
  }
  state.board = state.board;
  //Vars for use in functions
  state.playerNames = ['', ''];
  state.currentPlayerIdx = 0;
  state.getCurrentPlayer = () => state.playerNames[state.currentPlayerIdx];
  state.inProgress = false;
  state.isDraw = false;
  state.p1Turn = true;
  state.p2Turn = false;
  state.vsCPU = false;
  state.playerMove = 'p1move';
  state.scores = [0, 0];
  state.singlePlayer = false;
};

// ***************** DOM SELECTORS *****************
const boardElem = document.querySelector('#board');
const playerTurnElem = document.querySelector('#player-turn');
const scoreElem1 = document.querySelector('#score-p1');
const scoreElem2 = document.querySelector('#score-p2');

// ***************** DOM MANIPULATION FUNCTIONS *****************
const renderBoard = () => {
  boardElem.innerHTML = '';
  //create columns and rows on DOM
  for (let rowIdx = 0; rowIdx < state.board.length; rowIdx++) {
    let column = state.board[rowIdx];
    for (let colIdx = 0; colIdx < column.length; colIdx++) {
      let circle = column[colIdx];
      let circElem = document.createElement('div');
      circElem.classList.add(circle);
      circElem.dataset.coordinates = `${rowIdx},${colIdx}`;
      boardElem.appendChild(circElem);
    }
  }
};

//Render player name inputs and game message
const renderPlayer = () => {
  let text;
  if (!state.playerNames[0] || !state.playerNames[1] && !state.singlePlayer) {
    text = `
      <input name='player1' class='p1name' id='p1Input' placeholder='Enter Player 1'>
      <input name='player2' class='p2name' id='p2Input' placeholder='Enter Player 2'>
      <button class='start'>GO!</button>
    `;
  } else if (state.isDraw) {
    text = `
      <div class='next-game'>
        <span class='game-over'>The game is a draw!</span>   
        <button class='reset'>Play Again!</button>
        <button class='restart'>Restart Game</button>
      </div>
    `;
  } else if (!state.isDraw && !state.inProgress && checkP1Win()) {
    text = `
    <div class='next-game'>
      <span class='game-over'>${state.playerNames[0]} wins!</span> 
      <button class='reset'>Play Again!</button>
      <button class='restart'>Restart Game</button>
    </div>
    `;
  } else if (!state.isDraw && !state.inProgress && checkP2Win()) {
    text = `
    <div class='next-game'>
      <span class='game-over'>${state.playerNames[1]} wins!</span> 
      <button class='reset'>Play Again!</button>
      <button class='restart'>Restart Game</button>
    </div>
    `;
  } else {
    text = `It's currently ${state.getCurrentPlayer()}'s turn.`;
  }
  playerTurnElem.innerHTML = text;
};

const renderScore = () => {
  scoreElem1.innerHTML = `
    <div class='score'>P1</div>
    <div class='score'>${state.playerNames[0]}</div>
    <div class='score'>Wins: ${state.scores[0]}</div>    
  `;
  scoreElem2.innerHTML = `
    <div class='score'>P2</div>
    <div class='score'>${state.playerNames[1]}</div>
    <div class='score'>Wins: ${state.scores[1]}</div>    
  `;
};

//Make a move and change turns

const playerMove = (event) => {
  const target = event.target;
  //Check if computer won before making player move if single player
  if (state.singlePlayer) checkWon();
  if (event.target.className === 'circle' && state.inProgress && state.p1Turn) {
    dropInCol(event);
    checkWon();
    state.p1Turn = false;
    state.p2Turn = true;
    state.playerMove = 'p2move';
    state.currentPlayerIdx = 1;
  }
  else if (event.target.className === 'circle' && state.inProgress && state.p2Turn && !state.vsCPU) {
    dropInCol(event);
    checkWon();
    state.p1Turn = true;
    state.p2Turn = false;
    state.playerMove = 'p1move';
    state.currentPlayerIdx = 0;
  };
  cpuMove();
  render();
};

// ************** GAME LOGIC FUNCTIONS **********
const dropInCol = (event) => {
  const checkElem = event.target;
  const [y, x] = checkElem.dataset.coordinates.split(',');
  for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
    if (state.board[rowIdx][x] !== 'circle') {
      state.board[rowIdx - 1][x] = state.playerMove;
      return;
    }
    else if (rowIdx === 5) {
      state.board[rowIdx][x] = state.playerMove;
      return;
    };
  };
};

const cpuMove = () => {
  if (state.vsCPU && !state.p1Turn) {
    state.currentPlayerIdx = 1;
    state.playerNames[1] = 'Computer';    
    //Check if player1 won before making computer move if single player
    if (state.singlePlayer) checkWon();
    let cy = Math.round(Math.floor(Math.random() * (5 - 0 + 1) + 0));
    let cx = Math.round(Math.floor(Math.random() * (6 - 0 + 1) + 0));
    const coords = [cy, cx];
    for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
      if (state.board[rowIdx][cx] !== 'circle') {
        state.board[rowIdx - 1][cx] = state.playerMove;        
        state.p1Turn = true;
        state.p2Turn = false;
        state.playerMove = 'p1move';
        state.currentPlayerIdx = 0;
        return;
      }
      else if (rowIdx === 5) {
        state.board[rowIdx][cx] = state.playerMove;        
        state.p1Turn = true;
        state.p2Turn = false;
        state.playerMove = 'p1move';
        state.currentPlayerIdx = 0;
        return;
      };
      checkWon();      
    };
  }
  else return;
};

//******* FUNCTIONS TO CHECK WHEN GAME OVER **********
//If all spots are taken and none have 'circle' class declare draw
const checkDraw = () => {
  let count = 0;
  for (let y = 0; y < state.board.length; y++) {
    let rows = state.board[y];
    for (let x = 0; x < rows.length; x++) {
      let cols = rows[x];
      if (cols.includes('circle') || rows.includes('circle')) count++;
      if (count === 0) {
        return true;
      };
    };
  };
  return;
};

//If checkWins (moved to checkWin.js) or checkDraw return true then game over
const checkWon = () => {
  if (state.currentPlayerIdx === 0) checkP1Win();
  if (state.currentPlayerIdx === 1) checkP2Win();
  if (checkP1Win()) {
    state.inProgress = false;
    state.scores[0]++;
  };
  if (checkP2Win()) {
    state.inProgress = false;
    state.scores[1]++;
  };
  if (checkDraw()) {
    state.inProgress = false;
    state.isDraw = true;
  };
};

// ************** HELPER FUNCTIONS **************
const render = () => {
  renderScore();
  renderBoard();
  renderPlayer();
};

const startGame = () => {
  const player1Input = document.querySelector('input[name=player1]');
  state.playerNames[0] = player1Input.value;
  const player2Input = document.querySelector('input[name=player2]');
  state.playerNames[1] = player2Input.value;
  //Randomly choose first player and set player
  const startFirst = Math.round(Math.random());
  state.currentPlayerIdx = startFirst;
  if (startFirst === 0) {
    state.p1Turn = true;
    state.p2Turn = false;
  } else {
    state.p1Turn = false;
    state.p2Turn = true;
    state.playerMove = 'p2move';
  }
  render();
};

const playAgain = () => {
  state.board = [];
  for (let i = 0; i < 6; i++) {
    state.board.push(['circle' , 'circle' , 'circle' , 'circle' , 'circle' , 'circle' , 'circle']);
  };
  if (state.vsCPU) {
    state.p1Turn = true;
    state.p2Turn = false;
    state.currentPlayerIdx = 0;
    state.playerMove = 'p1move';
  }
  state.board = state.board;
  state.inProgress = true;
  state.isDraw = false;
  render();
};

const restartGame = () => {
  resetState();
  render();
};

// **************** EVENT LISTERNERS *****************
board.addEventListener('click', playerMove);
playerTurnElem.addEventListener('click', function (event) {
  if (event.target.className !== 'start') return;
  else state.inProgress = true;
  let name1 = document.getElementById('p1Input').value
  let name2 = document.getElementById('p2Input').value  
  if (name2 === '') {
    state.vsCPU = true;
    state.playerNames[1] = 'Computer';
    state.singlePlayer = true;      
  }
  startGame();
});
playerTurnElem.addEventListener('click', function (event) {
  if (event.target.className !== 'reset') return;
  else playAgain();
});
playerTurnElem.addEventListener('click', function (event) {
  if (event.target.className !== 'restart') return;
  else restartGame();
});

// ***************** BOOTSTRAPPING *****************
resetState();
render();
