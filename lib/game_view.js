// const Game = require('./game.js');
// const KeyMaster = require('./../public/keymaster.js');

let GameView = function GameView(game, ctx) {
  this.game = game;
  this.ctx = ctx;
};


GameView.prototype.start = function(){
  let game = this.game;
  let ctx = this.ctx;

  const img = new Image();
  img.onload = function () {ctx.drawImage(img, 0, 0);};
  img.src = './public/images/space.jpg';

  this.bindKeyHandlers();
  let run = function() {
    if (game.checkWin()) {
      alert('You Won!!!!!!!');
    } else {
      game.step();
      game.draw(ctx, img);
      game.checkWin();
      window.requestAnimationFrame(run);
    }
  };

  window.requestAnimationFrame(run);
};

GameView.prototype.bindKeyHandlers = function(){
  let ship = this.game.ship;
  key('w', function(){ ship.power([0, -1]); });
  key('a', function(){ ship.power([-1, 0]);  });
  key('s', function(){ ship.power([0, 1]); });
  key('d', function(){ ship.power([1, 0]);  });

  key('w', function(){ ship.power([0, -1]); });
  key('a', function(){ ship.power([-1, 0]);  });
  key('s', function(){ ship.power([0, 1]); });
  key('d', function(){ ship.power([1, 0]);  });
  
  key('space', function(){ ship.fireBullet(); });
};



module.exports = GameView;
