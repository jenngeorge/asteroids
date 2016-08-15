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
