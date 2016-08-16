const MovingObject = require('./moving_object.js');
const Asteroid = require('./asteroid.js');
const Util = require('./utils.js');

const COLOR = "#cc00ff";
const RADIUS = 2;

let Bullet = function Bullet(ship) {
  let bulletHash = {
    color: COLOR,
    radius: RADIUS,
    pos: this.setPosition(ship),
    vel: this.setVelocity(ship),
    game: ship.game
  };
  MovingObject.call(this, bulletHash);
};

Util.inherits(Bullet, MovingObject);

Bullet.prototype.isWrappable = false;

Bullet.prototype.setPosition = function(ship){
  let x = ship.pos[0] + ship.radius + (5 * ship.vel[0]);
  let y = ship.pos[1] + ship.radius + (5 * ship.vel[1]);
  return [x, y];
};

Bullet.prototype.setVelocity= function(ship) {
  if (ship.vel[0] === 0 && ship.vel[1] === 0) {
    return [1, 0];
  }
  let x = ship.vel[0] * 2;
  let y = ship.vel[1] * 2;
  return [x, y];
};


Bullet.prototype.collideWith = function(otherObject) {
  if (otherObject.constructor === Asteroid) {
    this.game.remove(otherObject);
    this.game.remove(this);
  }
};

module.exports = Bullet;
