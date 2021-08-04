import {LEVEL, OBJECT_TYPE} from './setup';
import GameBoard from './GameBoard';
import Pacman from './Pacman';
import { Ghost } from './Ghost';
import { randomMovement } from './ghostMoves';
import soundDot from './sounds/munch.wav';
import soundPill from './sounds/pill.wav';
import soundGameStart from './sounds/game_start.wav';
import soundGameOver from './sounds/death.wav';
import soundGhost from './sounds/eat_ghost.wav';
//DOM elements

const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

//Game Constant
const POWER_PILL_TIME = 10000;
const GLOBAL_SPEED  = 80;
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

//Initial Setup
let score =0;
let timer = null;
let gameWin = false;
let powerPillActive =false;
let powerPillTimer = null;

//audio
function playAudio(audio){
  const soundEffect = new Audio(audio);
  soundEffect.play();
}

//gameOver
function gameOver(pacman, grid){
   playAudio(soundGameOver);

  document.removeEventListener('keydown', (e)=>
  pacman.handleKeyInput(e,gameBoard.objectExists.bind(gameBoard))
);

gameBoard.showGameStatus(gameWin);
clearInterval(timer);
startButton.classList.remove('hide');

}

function checkCollision(pacman, ghosts){
  const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);

  if (collidedGhost) {

    if (pacman.powerPill) {
      playAudio(soundGhost);
      gameBoard.removeObject(collidedGhost.pos, [
        OBJECT_TYPE.GHOST,
        OBJECT_TYPE.SCARED,
        collidedGhost.name
      ]);
      collidedGhost.pos = collidedGhost.startPos;
      score += 100;
    } else {
      gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
      gameBoard.rotateDiv(pacman.pos, 0);
      gameOver(pacman, gameGrid);
    }
  }
}



function gameLoop(pacman, ghosts){
  //console.log("Works");
  gameBoard.moveCharacter(pacman);
  checkCollision(pacman, ghosts);

  ghosts.forEach((ghost) =>{ gameBoard.moveCharacter(ghost);});
  checkCollision(pacman, ghosts);
  
if( gameBoard.objectExists(pacman.pos,OBJECT_TYPE.DOT)){
  playAudio(soundDot);
  gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
  gameBoard.dotCount--;
  score+=10;
}

//eat powerPIll and scare ghost
if( gameBoard.objectExists(pacman.pos,OBJECT_TYPE.PILL)){
  playAudio(soundPill);
  gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
  pacman.powerPill=true;
  score+=50;
  clearTimeout(powerPillTimer);
  powerPillTimer = setTimeout(
    ()=>(pacman.powerPill = false), 
    POWER_PILL_TIME
  );
}

//change ghost scare mode 
if (pacman.powerPill !== powerPillActive) {
  powerPillActive = pacman.powerPill;
  ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
}

if(gameBoard.dotCount===0){
  gameWin = true;
  gameOver(pacman, ghosts);

}
scoreTable.innerHTML = score;
}

//to start the game
function startGame(){
 console.log("Started");
 playAudio(soundGameStart);
 gameWin = false;
 powerPillActive = false;
 score = 0;

 startButton.classList.add('hide');
 gameBoard.createGrid(LEVEL);

 const pacman = new Pacman(2, 287);
 gameBoard.addObject(287,[OBJECT_TYPE.PACMAN]);
 //console.log(gameBoard);
 document.addEventListener('keydown', (e)=>
     pacman.handleKeyInput(e,gameBoard.objectExists.bind(gameBoard))
 );
 const ghosts = [
   new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
   new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
   new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
   new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE),
 ];
//  ghosts.forEach((ghost)=>{
//    gameBoard.addObject(ghost.pos, [ghost.name, OBJECT_TYPE.GHOST]);
//  });
 
 
 
  timer = setInterval( ()=>gameLoop(pacman, ghosts),GLOBAL_SPEED);
}

//Initialize game
startButton.addEventListener('click',startGame);
