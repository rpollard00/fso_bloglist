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

afterAll(() => {
  mongoose.connection.close()
})