const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('get blogs returns the correct amount', async () => {
  const response = await api.get('/api/blogs')
  
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  console.log(response.body[0])
  expect(response.body[0]["id"]).toBeDefined()
})

test('http post successfully creates post', async () => {
  const blog = {
    title: "Python Dependency Management is Bad",
    author: "Captain Postman",
    url: "http://pizza.ru",
    likes: 42,
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('Python Dependency Management is Bad')
})

test('http post without likes has 0 likes', async () => {
  const blog = {
    title: "Why plantains are bad for you",
    author: "Cavesmash Grogman",
    url: "http://pizza.ru",
  }

  const response = await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  console.log('response', response.body)
  
  const blogPostJson = await helper.blogsInDb()
  const blogPost = Object.values(blogPostJson).find(b => b.id === response.body.id)

  expect(blogPost.likes).toBeDefined()
  expect(blogPost.likes).toBe(0)
 
})


afterAll(() => {
  mongoose.connection.close()
})