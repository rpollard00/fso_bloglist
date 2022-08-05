const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
  {
    title: "2Cool Blog",
    author: "Diego Castillo",
    url: "http://bogus.xyz",
    likes: 333,
  },
  {
    title: "Why Blog",
    author: "Diego Castillo",
    url: "http://bogus.xyz",
    likes: 15,
  },
  {
    title: "Test Blog",
    author: "Sunny Log",
    url: "http://bogus.xyz",
    likes: 1800,
  },
  {
    title: "Frogs are weird",
    author: "Dave Tendo",
    url: "http://bogus.xyz",
    likes: 4,
  },
  {
    title: "Ice Blogging",
    author: "Dave Tendo",
    url: "http://bogus.xyz",
    likes: 28,
  },
  {
    title: "Is Bloggin Wrong?",
    author: "Diego Castillo",
    url: "http://bogus.xyz",
    likes: 1,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async() => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}
