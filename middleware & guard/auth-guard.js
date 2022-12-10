module.exports.isloggedOut = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send("already logged in");
  }
};
module.exports.isloggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(403).send("Must log in to view this page");
  }
};
