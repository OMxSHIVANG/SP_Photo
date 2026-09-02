module.exports = function(fn) {
  return (req, res, next) => {
    if (typeof fn !== "function") {
      return next(new Error("wrapAsync expected a function, received " + typeof fn));
    }
    fn(req, res, next).catch(next);
  };
}
