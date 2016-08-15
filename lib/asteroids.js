const GameView = require('./game_view.js');
const Game = require('./game.js');
const KeyMaster = require('./../public/keymaster.js');

const canvasEl = document.getElementsByTagName("canvas")[0];
let ctx = canvasEl.getContext('2d');
let game = new Game();

let gameView = new GameView(game, ctx);
gameView.start();

window.gameView = gameView;
