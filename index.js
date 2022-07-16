const PLAYER_X = 'X';
const PLAYER_O = "O";
let player_turn = true;
let xCount = 0;
let oCount = 0;
let drawCount = 0;
let id;
let num = 20;

const winnerCombinations = [
    {combo: [1, 2, 3], linePosition: 'line-row-1'},
    {combo: [4, 5, 6], linePosition: 'line-row-2'},
    {combo: [7, 8, 9], linePosition: 'line-row-3'},
    {combo: [1, 4, 7], linePosition: 'line-column-1'},
    {combo: [2, 5, 8], linePosition: 'line-column-2'},
    {combo: [3, 6, 9], linePosition: 'line-column-3'},
    {combo: [3, 5, 7], linePosition: 'line-diagonal-1'},
    {combo: [1, 5, 9], linePosition: 'line-diagonal-2'}
]

const boxs = document.querySelectorAll('.box');
const time = document.getElementById('time');
const displayPlayer = document.getElementById('display-player');
const winnerLine = document.querySelector('.winner-line');
const messageDiv = document.querySelector('.message-div');
const messageText = document.getElementById('message-text');
const newGameStartBtn = document.getElementById('newGameStart-button');
const X_WINS_COUNT = document.getElementById('x-wins');
const O_WINS_COUNT = document.getElementById('o-wins');
const DRAW_COUNT = document.getElementById('draw');

randomStart();

newGameStartBtn.addEventListener('click', startNewGame);
boxs.forEach(box => box.addEventListener('click', boxClick));

const boardInnerInfo = new Array(boxs.length);
boardInnerInfo.fill(null);

function randomStart () {
    let number = Math.round(Math.random() * 10);
    
    if (number > 5) {
        player_turn = true;
        displayPlayer.innerText = PLAYER_X;
    } else {
        player_turn = false;
        displayPlayer.innerText = PLAYER_O;
    }
}

function boxClick (e) {
    const box = e.target;
    const boxIndex = e.target.id;

    if (box.innerText != "") {
        return;
    }

    if (id) {
        clearInterval(id);
        num = 20;
    }

    if (player_turn) {
        box.innerText = PLAYER_X;
        boardInnerInfo[boxIndex - 1] = PLAYER_X;
        player_turn = !player_turn;
        displayPlayer.innerText = PLAYER_O;
    } else {
        box.innerText = PLAYER_O;
        boardInnerInfo[boxIndex - 1] = PLAYER_O;
        player_turn = !player_turn;
        displayPlayer.innerText = PLAYER_X;
    }

    checkWinner()
    setTime()
}

function setTime () {
    if (messageDiv.classList.contains('visivle')) {
        return;
    }
    id = setInterval(() => {
        time.innerText = 'Time` ' + --num;
        if (num === 0) {
            gameOver('timed out');
        }
    }, 1000)
}

function checkWinner () {
    for (const winnerCombination of winnerCombinations) {
        const {combo, linePosition} = winnerCombination;
        const boxValue1 = boardInnerInfo[combo[0] - 1];
        const boxValue2 = boardInnerInfo[combo[1] - 1];
        const boxValue3 = boardInnerInfo[combo[2] - 1];

        if (
            boxValue1 !== null &&
            boxValue1 === boxValue2 &&
            boxValue1 === boxValue3
        ) {
            winnerLine.classList.add(linePosition);
            gameOver(boxValue1);
            return;
        } 
    }

    const checkAllElements = boardInnerInfo.every(info => info !== null);
    if (checkAllElements) {
        gameOver(null);
    }
}

function gameOver (winnerText) {
    let text = 'DRAW!';
    if (winnerText === 'timed out') {
        text = player_turn ? 'Player ' + "O" + " WON!" : 'Player ' + "X" + " WON!";
    }
    
    if (winnerText != null && winnerText != 'timed out') {
        text = 'Player ' + winnerText + " WON!";
    }

    if (text === 'DRAW!') {
        DRAW_COUNT.innerText = "Draws - " + ++drawCount;
    } 
    if (text === 'Player ' + "X" + " WON!") {
        X_WINS_COUNT.innerText = "X's Wins - " + ++xCount;
    }
    if (text === 'Player ' + "O" + " WON!") {
        O_WINS_COUNT.innerText = "O's Wins - " + ++oCount;
    }

    clearInterval(id);
    num = 20;
    time.innerText = 'Time` ' + num;

    messageText.innerText = text;
    messageDiv.classList.remove('hidden');
    messageDiv.classList.add('visivle');
}

function startNewGame () {
    messageDiv.className = 'message-div hidden';
    winnerLine.className = 'winner-line';
    boardInnerInfo.fill(null);
    boxs.forEach(box => box.innerText = "");
}