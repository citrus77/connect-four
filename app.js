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
    board.push([])
  };
};

// ***************** DOM SELECTORS *****************
let boardElem = document.querySelector('#board');


// ***************** DOM MANIPULATION FUNCTIONS *****************
function renderBoard () {
    boardElem.innerText = '';
}