const MovingObject = require('./moving_object.js');
const Util = require('./utils.js');
const Ship = require('./ship.js');


const COLOR = "#ff0000";
const RADIUS = 20;
let Asteroid = function Asteroid(args) {
  let asteroidHash = {
    color: COLOR,
    radius: RADIUS,
    pos: args['pos'],
    vel: Util.randomVec(2),
    game: args['game']
  };
  MovingObject.call(this, asteroidHash);
};

Util.inherits(Asteroid, MovingObject);

Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject.constructor === Ship) {
    otherObject.relocate();
  }

};

module.exports = Asteroid;
