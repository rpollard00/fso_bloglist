const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const Comment = require("../models/comment")
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
    .populate('comments', { content: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post("/", async (request, response) => {
  const body = request.body
  const token = request.token
  const user = request.user
  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  //const user = await User.findById(decodedToken.id)

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
    author: body.author,
    user: body.user.id,
    comments: body.comments.id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(updatedBlog) 
})

blogRouter.post("/:id/comments", async (request, response) => {
  const body = request.body
  const comment = new Comment({
    content: body.content
  })
  logger.info("Please work pleaase")
  const newComment = await comment.save()
  console.log("newComment", newComment)
  // find the blog
  const blog = await Blog.findById(request.params.id)
  // update the blog's comment array with the new comment id
  blog.comments = blog.comments.concat(newComment._id) || [newComment._id]
  await blog.save()
  //const updatedBlog = { ...blog, comments: blog.comments.concat(newComment._id) || [newComment._id]}
  //console.log("updatedBlog with comment", updatedBlog)
  // save the blog to the database
  //await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
  // return the comment
  response.status(201).json(newComment)
})

blogRouter.delete("/:id", async (request, response) => {
  const token = request.token
  const user = request.user

  const decodedToken = jwt.verify(token, process.env.SECRET)
  const blog = await Blog.findById(request.params.id)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  

  // if user didn't post blog, they can't delete it
  if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'deletion forbidden due to invalid token'})
  }
  
  await Blog.findByIdAndRemove(blog._id.toString())
  response.status(204).end()
})

module.exports = blogRouter
