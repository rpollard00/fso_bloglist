const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('Add Users', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('cobblebobbins', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('Create a valid new user', async () => {
  
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "tacotruck",
      name: "Taco Commander",
      password: "andre3000"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  expect(usernames).toContain(newUser.username)

})
