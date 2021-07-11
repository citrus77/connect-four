// testing
let testElem = document.querySelector('#board');
console.log('testElem: ', testElem);

// ***************** STATE *****************
let state = {
  board: board,
  players: ['red', 'blue']
};

function resetState () {
  state.board = [];
  for (let i = 0; i < 7; i++) {
    state.board.push([], [], [], [], [], [])
    
  };
  console.log(state.board)
};

// ***************** DOM SELECTORS *****************
let boardElem = document.querySelector('#board');


// ***************** DOM MANIPULATION FUNCTIONS *****************
function renderBoard () {
  boardElem.innerText = '';
  for(let i = 0; i < state.board.length; i++) {
    let col = state.board[i]
    //create a row
    let colElem = document.createElement('div');
    colElem.classList.add('col');
    colElem.dataset.index = i;
    colElem.innerHTML = col;
    boardElem.appendChild(colElem);
  }

}

// ***************** BOOTSTRAPPING *****************
resetState();
renderBoard();