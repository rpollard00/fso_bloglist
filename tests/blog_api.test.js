const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe("GET tests", () => {
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
    expect(response.body[0]["id"]).toBeDefined()
  })
})


describe('POST and DELETE blogs', () => {
  let token = ""
  beforeEach(async () => {
    const TEST_USERNAME = 'root'
    const TEST_PASSWORD = 'cobblebobbins'

    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10)
    const user = new User({ username: TEST_USERNAME, passwordHash })

    await user.save()

    await Blog.insertMany([{
      title: "Is Bloggin Wrong?",
      author: "Diego Castillo",
      url: "http://bogus.xyz",
      likes: 1,
      user: user._id.toString()
    }])

    const login = {
      "username": TEST_USERNAME,
      "password": TEST_PASSWORD
    }

    const loggedInUser = await api
      .post('/api/login')
      .send(login)
      .expect(200)

    token = loggedInUser.body.token
  })

  test('http post successfully creates post', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blog = {
      title: "Python Dependency Management is Bad",
      author: "Captain Postman",
      url: "http://pizza.ru",
      likes: 42,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

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
      .set('Authorization', `bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    
    const blogPostJson = await helper.blogsInDb()
    const blogPost = Object.values(blogPostJson).find(b => b.id === response.body.id)

    expect(blogPost.likes).toBeDefined()
    expect(blogPost.likes).toBe(0)
  
  })


  test('http post without token is rejected', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blog = {
      title: "Mariners want to win",
      author: "Erik Swanson",
      url: "http://pizza.ru",
      likes: 42,
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain('Mariners want to win')
  })

  test('http post without title and url is rejected', async () => {
    const blog = {
      author: "Missing Fields",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blog)
      .expect(400)
    
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    expect(blogsAtEnd).not.toContain(blogToDelete.title)
  })

})

describe('PUT: a blog is updated', () => {
  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    
    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 422,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const blogPost = Object.values(blogsAtEnd).find(b => b.id === blogToUpdate.id)
    
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    expect(blogPost.likes).toBe(updatedBlog.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})