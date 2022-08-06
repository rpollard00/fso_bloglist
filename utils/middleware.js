const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    response.status(400).json({ 'error': error.message })
  } else if (error.name === "MongoServerError" && error.code === 11000) {
    response.status(409).json({ 'error': error.message })
  } else if (error.name === "JsonWebTokenError") {
    response.status(401).json({ 'error': error.message })
  }

  next(error)
}

const getTokenFrom = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    request["token"] = authorization.substring(7)
  } 

  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    request["user"] = user
  } 
  
  next()
}

module.exports = {
  errorHandler,
  getTokenFrom,
  userExtractor
}