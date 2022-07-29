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
async function checkUsernameExists(req, res, next) {
  /*
    If the username in req.body does NOT exist in the database
    status 401
    {
      "message": "Invalid credentials"
    }
  */
  try {
    const [user] = await Users.findBy({ username: req.body.username })
    if (!user) {
      next({ status: 401, message: 'Invalid credentials' })
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
  /*
    If the role_name in the body is valid, set req.role_name to be the trimmed string and proceed.

    If role_name is missing from req.body, or if after trimming it is just an empty string,
    set req.role_name to be 'student' and allow the request to proceed.

    If role_name is 'admin' after trimming the string:
    status 422
    {
      "message": "Role name can not be admin"
    }

    If role_name is over 32 characters after trimming the string:
    status 422
    {
      "message": "Role name can not be longer than 32 chars"
    }
  */
  if (req.body.username || req.body.username.trim()) {
    next()
  }else if (req.body.username.trim() === '') {
    next({ status: 422, message: 'username taken'})
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
