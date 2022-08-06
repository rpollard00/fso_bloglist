const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require('jsonwebtoken')

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post("/", async (request, response) => {
  const body = request.body
  const token = request.token
  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!("title" in body) || !("url" in body)) {
    return response.status(400)
      .json({ 'error': 'Request missing required fields'})
  }

  const blog = new Blog({
    title: body.title || "No title",
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const newBlog = await blog.save()

  user.blogs = user.blogs.concat(newBlog._id) || [newBlog._id]
  await user.save()

  response.status(201).json(newBlog)
})

blogRouter.put("/:id", async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes,
    title: body.title,
    url: body.url,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(updatedBlog) 
})

blogRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogRouter
