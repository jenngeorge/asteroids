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
