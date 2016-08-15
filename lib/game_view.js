const Game = require('./game.js');
const KeyMaster = require('./../public/keymaster.js');

let GameView = function GameView(game, ctx) {
  this.game = game;
  this.ctx = ctx;
};


GameView.prototype.start = function(){
  let game = this.game;
  let ctx = this.ctx;
  this.bindKeyHandlers();
  setInterval(function() {
    game.step();
    game.draw(ctx);
  }, 20);
};

GameView.prototype.bindKeyHandlers = function(){
  key('a', function(){ alert('you pressed a!'); });
};

module.exports = GameView;
