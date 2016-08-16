const Util = require('./utils.js');
const MovingObject = require('./moving_object.js');
const Bullet = require('./bullet.js');

const COLOR = '#ff9900';
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
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

Ship.prototype.fireBullet = function(){
  this.game.addBullet(new Bullet(this));
};

module.exports = Ship;
