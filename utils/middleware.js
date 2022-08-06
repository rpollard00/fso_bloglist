const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  // logger.error("Message", error.message)
  // logger.error("Name", error.name)
  // logger.error("Keys", Object.keys(error))
  // logger.error("Code", error.code)

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

module.exports = {
  errorHandler,
  getTokenFrom
}