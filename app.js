const logger = require("./utils/logger")
const config = require("./utils/config")
const express = require("express")
require('express-async-errors')
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")

const blogRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")

logger.info(config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use("/api/blogs", blogRouter)
app.use("/api/users", usersRouter)

module.exports = app
