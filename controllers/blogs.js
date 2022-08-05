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
