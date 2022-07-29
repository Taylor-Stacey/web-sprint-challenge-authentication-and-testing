const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../data/dbConfig');

// AUTHENTICATION
const restrict = (req, res, next) => {
  jwt.verify(req.headers.authorization, JWT_SECRET, (err, decodedToken) => {
    if(err) {
      res.status(401).json({ message: 'user must be logged in' });
      return;
    }

    req.jwt = decodedToken;
    next();
  });
}

// AUTHORIZATION
const checkRole = role => (req, res, next) => {
  if(req.jwt.role != role) {
    res.status(403).json({ message: 'you are forbidden to access this endpoint'});
    return;
  }
  next()
}

module.exports = {
  restrict,
  checkRole,
}
