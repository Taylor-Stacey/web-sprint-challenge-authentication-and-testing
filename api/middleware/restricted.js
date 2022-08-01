const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets');
const User = require('../auth/auth-model')

// AUTHENTICATION
const restrict = (req, res, next) => {
  // jwt.verify(req.headers.authorization, JWT_SECRET, (err, decodedToken) => {
  //   if(err) {
  //     res.status(401).json({ message: 'user must be logged in' });
  //     return;
  //   }

  //   req.jwt = decodedToken;
  //   next();
  // });
  const token = req.headers.authorization
  if (!token) {
    return next({ status: 401, message: 'Token required' })
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'Token invalid' })
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
}
async function checkUsernameExists  (req, res, next)  {
  try {
    const [user] = await User.findBy({ username: req.body.username })
    if (user) {
      next({ status: 401, message: 'username taken' })
    }
    else {
      req.user = user
      next()
    }
  } catch (err) {
    next(err)
  }
}

const validateUserName = (req, res, next) => {
  let trimmedUsername = ''
  let trimmedPassword = ''
  if(req.body.username){
    trimmedUsername = req.body.username.trim()
  }
  if(req.body.password){
    trimmedPassword = req.body.password.trim()
  }
  if ( !trimmedUsername || !trimmedPassword ) {
    res.status(422).json({message: "username and password required"})
  }else {
    next()
  }
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
  checkUsernameExists,
  validateUserName
}
