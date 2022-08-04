const _ = require("lodash")

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  if (blogs.length === 0) {
    return 0
  }

  const total = blogs
    .map(blog => blog.likes)
    .reduce((sum, current) => {
      return sum + current
    }, 0)

  return total
}

const favoriteBlog = blogs => {
  return blogs.reduce((p, c) => {
    return p.likes > c.likes ? p : c
  }, {})
}

// The function returns the author who has the largest amount of blogs.
// The return value also contains the number of blogs the top author has
const mostBlogs = blogs => {
  if (blogs.length === 0) return {}

  const authors = blogs.map(blog => blog.author)

  // return the author name that occurs the most
  const mostAuthored = authors.reduce((mostAuthor, currentAuthor, _i, a) => {
    const mostAuthLen = a.filter(name => name === mostAuthor).length
    const currentAuthLen = a.filter(name => name === currentAuthor).length
    return mostAuthLen > currentAuthLen ? mostAuthor : currentAuthor
  }, authors[0])

  const numAuthored = authors.filter(name => name === mostAuthored).length

  return { author: mostAuthored, blogs: numAuthored }
}

const mostLikes = blogs => {
  // return empty object if bloglist is empty
  if (blogs.length === 0) return {}

  // group blogs by author
  const blogsByAuthor = _.groupBy(blogs, "author")

  // helper returns sum of likes per grouped author
  const likesForAuthor = (author) => {
    console.log('author', author)
    return author.reduce((sum, currentBlog) => sum + currentBlog.likes, 0)
  }

  // probably can refactor as map and get away from mutability
  let authorLikes = []

  for (const author in blogsByAuthor) {
    authorLikes.push({ "author": author, "likes": likesForAuthor(blogsByAuthor[author])})
  }

  // sort authors descending
  const sortedAuthors = authorLikes.sort((a, b) => b.likes - a.likes)
  
  return _.head(sortedAuthors)

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
