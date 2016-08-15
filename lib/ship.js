const Util = require('./utils.js');
const MovingObject = require('./moving_object.js');

const COLOR = '#0099ff';
const RADIUS = 10;

let Ship = function Ship(args) {
  let shipHash = {
    color: COLOR,
    radius: RADIUS,
    pos: args['game'].randomPosition(),
    vel: [0,0],
    game: args['game']
  };

  MovingObject.call(this, shipHash);
};

Util.inherits(Ship, MovingObject);

Ship.prototype.relocate = function() {
  this.vel = [0,0];
  this.pos = this.game.randomPosition();
};

Ship.prototype.power = function(impulse){
  this.vel[0] += impulse;
  this.vel[1] += impulse;
};

module.exports = Ship;
