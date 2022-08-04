const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const total = blogs
    .map((blog) => blog.likes)
    .reduce((sum, current) => {
      return sum + current
    }, 0)

  return total
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((p, c) => {
    return p.likes > c.likes ? p : c
  }, {})
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
