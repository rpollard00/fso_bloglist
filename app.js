const logger = require("./utils/logger")
const config = require("./utils/config")
const express = require("express")
require('express-async-errors')
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const middleware = require("./utils/middleware")

const blogRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")

logger.info(config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use("/api/login", loginRouter)
app.use(middleware.getTokenFrom)
app.use("/api/users", usersRouter)
app.use("/api/blogs", middleware.userExtractor, blogRouter)

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing")
  app.use("/api/testing", testingRouter)
}




app.use(middleware.errorHandler)

module.exports = app
