const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// what does this do ?
// it handles logging in the user based on the passwordHash matching what is in the db
// it then returns a signed TOKEN to the end user, the token must be valid to do post requests to
// the blogs API
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  
  // username is unique, so find the one matching filter
  const user = await User.findOne({ username })
  const passwordCorrect = user === null 
    ? false 
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter

