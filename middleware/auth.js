const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: "no token, authorization denied" });
  }
  //Verify token
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token not valid" });
  }
};
