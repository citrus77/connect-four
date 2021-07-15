// testing
// let testElem = document.querySelector('#board');
// console.log(`testElem: `, testElem);

// ***************** STATE *****************
let state = {};

//Set game state
const resetState = () => {
  state.board = [];
  //Create 7 arrays each containing 6 'circle's
  for (let i = 0; i < 6; i++) {
    state.board.push(['circle', 'circle', 'circle', 'circle', 'circle', 'circle', 'circle'])
  };
  state.board = state.board;
  //Vars for use in functions
  state.playerNames = ['', ''];
  state.currentPlayerIdx = 0;
  state.getCurrentPlayer = () => state.playerNames[state.currentPlayerIdx];
  state.inProgress = false;
  state.p1Turn = true;
  state.p2Turn = false;
  state.vsCPU = false;
  state.playerMove = 'p1move';
  state.scores = [0, 0];
  // console.log(state.board);
};


// ***************** DOM SELECTORS *****************
const boardElem = document.querySelector('#board');
const playerTurnElem = document.querySelector('#player-turn');
const scoreElem1 = document.querySelector('#score-p1');
const scoreElem2 = document.querySelector('#score-p2');
// const playerPosElem = document.querySelector('data-coordinates')


// ***************** DOM MANIPULATION FUNCTIONS *****************
const renderBoard = () => {
  boardElem.innerHTML = '';
  //create columns and rows on DOM
  for (let rowIdx = 0; rowIdx < state.board.length; rowIdx++) {
    let column = state.board[rowIdx]
    for (let colIdx = 0; colIdx < column.length; colIdx++) {
      let circle = column[colIdx]
      let circElem = document.createElement('div');
      circElem.classList.add(circle);
      circElem.dataset.coordinates = `${rowIdx},${colIdx}`;
      boardElem.appendChild(circElem);
    };
  };
};


//Make a move and change turns
const playerMove = (event) => {
  const target = event.target
  if (event.target.className === 'circle' && state.inProgress
    && state.p1Turn) {
    dropInCol(event);
    state.p1Turn = false;
    state.p2Turn = true;
    state.playerMove = 'p2move'
    state.currentPlayerIdx = 1;
  }
  else if (event.target.className === 'circle' && state.inProgress
    && state.p2Turn && !state.vsCPU) {
    dropInCol(event);
    state.p1Turn = true;
    state.p2Turn = false;
    state.playerMove = 'p1move'
    state.currentPlayerIdx = 0;
  }
  //UNCOMMENT BELOW AFTER FIGURING OUT VERSUSCPU FUNCTION
  /*
  else if (event.target.className === 'circle' && p2Turn && !p1Turn && vsCPU) {
    versusCPU ();
    dropInCol(event);
    state.p1Turn = true;
    state.p2Turn = false;
    state.playerMove = 'p1move'
    state.currentPlayerIdx = 0;
  }
  */
  render()
};


//Render player name inputs and game message
const renderPlayer = () => {
  let text;
  if (!state.playerNames[0] || !state.playerNames[1]) {
    text = `
      <input name="player1" class="p1name" placeholder="Enter Player 1">
      <input name="player2" class="p2name" placeholder="Enter Player 2">
      <button class="start">GO!</button>
    `
  } else {
    text = `It's currently ${state.getCurrentPlayer()}'s turn.`;
  }
  playerTurnElem.innerHTML = text;
};

const renderScore = () => {
  scoreElem1.innerHTML = `
    <div class="score">P1</div>
    <div class="score">${state.playerNames[0]}</div>
    <div class="score">Wins: ${state.scores[0]}</div>    
  `;
  scoreElem2.innerHTML = `
    <div class="score">P2</div>
    <div class="score">${state.playerNames[1]}</div>
    <div class="score">Wins: ${state.scores[1]}</div>    
  `;
};


// ************** GAME LOGIC FUNCTIONS **********
const dropInCol = (event) => {
  const checkElem = event.target;
  const [y, x] = checkElem.dataset.coordinates.split(',');
  for (let rowIdx = 0; rowIdx < state.board.length; rowIdx++) {
    if (state.board[rowIdx][x] !== 'circle') {
      state.board[rowIdx - 1][x] = state.playerMove;
      return;
    }
    else if (rowIdx === 5) {
      state.board[rowIdx][x] = state.playerMove;
    };
  };
};

const checkWin = () => {
  
};

/*
const versusCPU = () => {

};
*/


// ************** HELPER FUNCTIONS **************
const render = () => {
  renderScore();
  renderBoard();
  renderPlayer();
};

const startGame = (event) => {
  if (event.target.className !== 'start') {
    state.inProgress = true;
    return;
  }
  const player1Input = document.querySelector('input[name=player1]');
  state.playerNames[0] = player1Input.value;
  const player2Input = document.querySelector('input[name=player2]');
  state.playerNames[1] = player2Input.value;
  //Randomly choose first player and set player
  const startFirst = Math.round(Math.random())
  state.currentPlayerIdx = startFirst;
  if (startFirst === 0) {
    state.p1Turn = true;
    state.p2Turn = false;
  } else {
    state.p1Turn = false;
    state.p2Turn = true;
    state.playerMove = 'p2move';
  };
  render();
};

const isTaken = ([rowIdx, x]) => {
  if ([y, x] === 'p1move' || [y][x] === 'p2move') return true;
}


//SHUFFLE FUNCTION BORROWED FROM;
//https://bost.ocks.org/mike/shuffle
const shuffle = (array) => {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  };
  return array;
};

// **************** EVENT LISTERNERS *****************
board.addEventListener('click', playerMove);

playerTurnElem.addEventListener('click', startGame);

// ***************** BOOTSTRAPPING *****************
resetState();
render();