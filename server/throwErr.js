module.exports = function(err) {
  console.log(err.stack);
  throw err;
};
