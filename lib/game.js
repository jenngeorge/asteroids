const Asteroid = require ('./asteroid.js');
const Ship = require ('./ship.js');

const DIM_X = 1000;
const DIM_Y = 600;
const NUM_ASTEROIDS = 5;

let Game = function Game(args) {
  this.asteroids = [];
  this.bullets = [];
  this.addAsteroids();
  this.ship = new Ship({'game': this});
};

Game.prototype.addAsteroids = function(){
  for (let i = 0; i < NUM_ASTEROIDS; i++) {
    let pos = this.randomPosition();
    this.asteroids.push(new Asteroid({'pos': pos, 'game': this}));
  }
};

Game.prototype.addBullet = function(obj){
  this.bullets.push(obj);
};

Game.prototype.draw = function(ctx, imgage) {
  let objects = this.allObjects();
  ctx.clearRect(0, 0, DIM_X, DIM_Y);
  imgage.onload();
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

Game.prototype.remove = function(obj) {
  let objArr = [];
  if (obj.constructor === Asteroid) {
    objArr = this.asteroids;
  } else {
    objArr = this.bullets;
  }

  let idx = objArr.indexOf(obj);
  let front = objArr.slice(0, idx);
  let back = objArr.slice(idx + 1, objArr.length);
  objArr = front.concat(back);

  if (obj.constructor === Asteroid) {
    this.asteroids = objArr;
  } else {
    this.bullets = objArr;
  }
};

Game.prototype.randomPosition = function(){
  let posX = Math.random() * DIM_X;
  let posY = Math.random() * DIM_Y;
  return [posX, posY];
};

Game.prototype.allObjects = function() {
  let objects = Array.from(this.asteroids);
  objects.push(this.ship);
  objects = objects.concat(this.bullets);

  return objects;
};

Game.prototype.isOutOfBounds = function(pos) {
  if (pos[0] > DIM_X || pos[1] > DIM_Y) {
    return true;
  }
  return false;
};

Game.prototype.checkWin = function(loop) {
  if (this.asteroids.length === 0) {
    return true;
  }
  return false;
};

module.exports = Game;
