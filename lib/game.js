const Asteroid = require ('./asteroid.js');
const Ship = require ('./ship.js');

const DIM_X = 1000;
const DIM_Y = 600;
const NUM_ASTEROIDS = 50;

let Game = function Game(args) {
  this.asteroids = [];
  this.addAsteroids();
  this.ship = new Ship({'game': this});
};

Game.prototype.addAsteroids = function(){
  for (let i = 0; i < NUM_ASTEROIDS; i++) {
    let pos = this.randomPosition();
    this.asteroids.push(new Asteroid({'pos': pos, 'game': this}));
  }
};

Game.prototype.draw = function(ctx) {
  let objects = this.allObjects();
  ctx.clearRect(0, 0, DIM_X, DIM_Y);
  objects.forEach((ast) => ast.draw(ctx));
};

Game.prototype.moveObjects = function() {
  let objects = this.allObjects();

  objects.forEach((ast) => ast.move());
};

Game.prototype.wrap = function(pos) {

  pos[0] = (pos[0] % DIM_X);
  pos[1] = (pos[1] % DIM_Y);

  if(pos[0] <  0){pos[0] += DIM_X;}
  if(pos[1] <  0){pos[1] += DIM_Y;}

  return pos;
};

Game.prototype.checkCollisions = function(){
  let objects = this.allObjects();
  for (let i = 0; i < objects.length - 1; i++) {
    for (let j = (i + 1); j < objects.length; j++) {
      if (objects[i].isCollidedWith(objects[j])) {
        objects[i].collideWith(objects[j]);
      }
    }
  }
};

Game.prototype.step = function(){
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.remove = function(asteroid) {
  let idx = this.asteroids.indexOf(asteroid);
  let front = this.asteroids.slice(0, idx);
  let back = this.asteroids.slice(idx + 1, this.asteroids.length);
  this.asteroids = front.concat(back);
};

Game.prototype.randomPosition = function(){
  let posX = Math.random() * DIM_X;
  let posY = Math.random() * DIM_Y;
  return [posX, posY];
};

Game.prototype.allObjects = function() {
  let objects = Array.from(this.asteroids);
  objects.push(this.ship);
  return objects;

};

module.exports = Game;
