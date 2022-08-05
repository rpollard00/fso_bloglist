const blogRouter = require("express").Router()
const Blog = require("../models/blog")

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post("/", async (request, response) => {
  if (!("title" in request.body) || !("url" in request.body)) {
    return response.status(400)
      .json({ 'error': 'Request missing requried fields'})
  }
  
  const blog = new Blog(request.body)

  const newBlog = await blog.save()
  response.status(201).json(newBlog)
})

module.exports = blogRouter
