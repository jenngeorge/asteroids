/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	const Game = __webpack_require__(2);


	const canvasEl = document.getElementsByTagName("canvas")[0];
	let ctx = canvasEl.getContext('2d');
	let game = new Game();

	let gameView = new GameView(game, ctx);
	gameView.start();

	window.gameView = gameView;


/***/ },
/* 1 */
/***/ function(module, exports) {

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
	  let loop = setInterval(function() {
	    game.step();
	    game.draw(ctx, img);
	    game.checkWin(loop);
	  }, 20);
	};

	GameView.prototype.bindKeyHandlers = function(){
	  let ship = this.game.ship;
	  key('w', function(){ ship.power([0, -1]); });
	  key('a', function(){ ship.power([-1, 0]);  });
	  key('s', function(){ ship.power([0, 1]); });
	  key('d', function(){ ship.power([1, 0]);  });
	  key('space', function(){ ship.fireBullet(); });
	};



	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__ (3);
	const Ship = __webpack_require__ (6);

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
	    alert('You Won!!!!!!!');
	    clearInterval(loop);
	  }
	};

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Bullet = __webpack_require__(8);
	const Util = __webpack_require__(5);
	const Ship = __webpack_require__(6);


	const COLOR = "#00ccff";
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
	  } else if (otherObject.constructor === Bullet) {
	    this.game.remove(otherObject);
	    this.game.remove(this);
	  }
	};

	module.exports = Asteroid;


/***/ },
/* 4 */
/***/ function(module, exports) {

	let MovingObject = function MovingObject(argsHash) {
	  this.pos = argsHash['pos'];
	  this.vel = argsHash['vel'];
	  this.radius = argsHash['radius'];
	  this.color = argsHash['color'];
	  this.game = argsHash['game'];

	};

	MovingObject.prototype.draw = function(ctx) {

	  ctx.fillStyle = this.color;
	  ctx.beginPath();

	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );
	  ctx.fill();
	};

	MovingObject.prototype.move = function() {
	  let x = this.pos[0] + this.vel[0];
	  let y = this.pos[1] + this.vel[1];
	  if (this.isWrappable) {
	    this.pos = this.game.wrap([x, y]);
	  } else {
	    if (this.game.isOutOfBounds(this.pos)){
	      this.game.remove(this);
	    } else {
	      this.pos = [x, y];
	    }
	  }
	};

	MovingObject.prototype.isCollidedWith = function(otherObject) {
	  let deltaX = Math.pow((this.pos[0] - otherObject.pos[0]), 2);
	  let deltaY = Math.pow((this.pos[1] - otherObject.pos[1]), 2);
	  let dist = Math.sqrt(deltaX + deltaY);
	  let reach = this.radius + otherObject.radius;
	  if (dist < reach) {
	    return true;
	  }
	  return false;
	};

	MovingObject.prototype.collideWith = function(otherObject) {};

	MovingObject.prototype.isWrappable = true;

	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports) {

	const Util = {
	  inherits(SubClass, SuperClass) {
	    function Surrogate() {}
	    Surrogate.prototype = SuperClass.prototype;
	    SubClass.prototype = new Surrogate();
	    SubClass.prototype.constructor = SubClass;
	  }




	};

	Util.randomVec = function(length){
	  //length is an int
	  let delta = 2 * Math.PI * Math.random();
	  let x = Math.sin(delta);
	  let y = Math.cos(delta);
	  return [x*length, y*length];
	};


	console.log(Util.randomVec(8));
	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const MovingObject = __webpack_require__(4);
	const Bullet = __webpack_require__(8);

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


/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Asteroid = __webpack_require__(3);
	const Util = __webpack_require__(5);

	const COLOR = "#ff0000";
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


/***/ }
/******/ ]);