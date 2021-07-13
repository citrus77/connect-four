// testing
let testElem = document.querySelector('#board');
console.log('testElem: ', testElem);

// ***************** STATE *****************
let state = {};

//Set game state
const resetState = () =>{
  state.board = [];
  //Create 7 arrays each containing 6 arrays
  for (let i = 0; i < 7; i++) {
    state.board.push([[], [], [], [], [], []])
  };  
  state.board = state.board;
  //Vars for use in functions
  state.players = ['1pRed', '2pYellow'];
  state.playerNames = ['', ''];
  state.currentPlayerIdx = 0;
  state.getCurrentPlayer = () => state.playerNames[state.currentPlayerIdx];
  state.inProgress = false;
  state.p1Turn = true;
  state.p2Turn = false;
  state.vsCPU = false;
  state.playerMove = 'p1-red move';
  // console.log(state.board);
};


// ***************** DOM SELECTORS *****************
const boardElem = document.querySelector('#board');
const playerTurnElem = document.querySelector('#player-turn');


// ***************** DOM MANIPULATION FUNCTIONS *****************
const renderBoard = () => {
  boardElem.innerText = '';
  //create columns and rows on DOM
  for (let i = 0; i < state.board.length; i++) {
    let column = state.board[i]
    for (let j = 0; j < column.length; j++) {
      let circle = column[j]
      let cirElem = document.createElement('div');
      cirElem.classList.add('circle');
      cirElem.dataset.index = [i, j];
      cirElem.innerHTML = circle;
      boardElem.appendChild(cirElem);
    };
  };
};

//Change player turns when move made
const playerMove = (event) => {
  const target = event.target
  if (event.target.className === 'circle' && state.inProgress && state.p1Turn && !state.p2Turn) {
    target.className = state.playerMove;
    state.p1Turn = false;
    state.p2Turn = true;
    state.playerMove = 'p2-yellow move'
    state.currentPlayerIdx = 1;
  }
  else if (event.target.className === 'circle' && state.inProgress && state.p2Turn && !state.p1Turn && !state.vsCPU) {
    target.className = state.playerMove;
    state.p1Turn = true;
    state.p2Turn = false;
    state.playerMove = 'p1-red move'
    state.currentPlayerIdx = 0;
  }
  //UNCOMMENT BELOW AFTER FIGURING OUT VERSUSCPU FUNCTION
  // else if (event.target.className === 'circle' && p2Turn && !p1Turn && vsCPU) {
  //   versusCPU ();
  //   target.className = playerTurn;
  //   p1Turn = true;
  //   p2Turn = false;
  //   playerTurn = 'p1-red move'
  //   state.currentPlayerIdx = 0;
  // }
  renderPlayer();
};

//Render player name inputs and game message
const renderPlayer = () => {
  let text;
  if(!state.playerNames[0] || !state.playerNames[1]) {
    text = `
      <input name="player1" class="p1name" placeholder="Enter Player 1">
      <input name="player2" class="p2name" placeholder="Enter Player 2">
      <button class="start">GO!</button>
    `
  } else {
    text = `It's currently ${state.getCurrentPlayer()}'s turn.`;
  }
  playerTurnElem.innerHTML = text;
}

// ************** GAME LOGIC FUNCTIONS **********
const checkMove = () => {
  
};

const checkWin = () => {
  
};

const versusCPU = () => {

}

// ************** HELPER FUNCTIONS **************
const render = () => {
  renderBoard();
  renderPlayer();
}

const check = () => {
  checkMove();
  checkWin();
}

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
    state.playerMove = 'p1-red move'
  } else {
    state.p1Turn = false;
    state.p2Turn = true;
    state.playerMove = 'p2-yellow move';
  };

  render();  
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
board.addEventListener('click', function (event) {
  playerMove(event);
});

playerTurnElem.addEventListener('click', function(event){
  startGame (event);
}) 

// ***************** BOOTSTRAPPING *****************
resetState();
render();