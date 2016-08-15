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
	const KeyMaster = __webpack_require__(7);

	const canvasEl = document.getElementsByTagName("canvas")[0];
	let ctx = canvasEl.getContext('2d');
	let game = new Game();

	let gameView = new GameView(game, ctx);
	gameView.start();

	window.gameView = gameView;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	const KeyMaster = __webpack_require__(7);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__ (3);
	const Ship = __webpack_require__ (6);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const Ship = __webpack_require__(6);


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

	  this.pos = this.game.wrap([x, y]);
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

	MovingObject.prototype.collideWith = function(otherObject) {


	};

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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.

	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];

	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }

	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }

	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };

	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;

	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }

	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);

	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;

	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;

	    scope = getScope();

	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];

	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };

	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);

	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }

	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };

	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };

	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }

	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };

	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;

	    multipleKeys = getKeys(key);

	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');

	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }

	      key = keys[keys.length - 1];
	      key = code(key);

	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };

	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }

	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }

	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }

	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;

	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };

	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;

	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };

	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }

	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }

	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };

	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);

	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);

	  // store previously defined key
	  var previousKey = global.key;

	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }

	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;

	  if(true) module.exports = assignKey;

	})(this);


/***/ }
/******/ ]);