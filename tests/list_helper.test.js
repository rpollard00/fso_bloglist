const listHelper = require("../utils/list_helper")

test("dummy returns one", () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

// hmm tests .... empty list of blogposts should return 0 likes
// a list with a single blogpost with 10 likes should return 10 likes
// a list with 3 blog posts, one with 333 likes, one with 10000 likes, and one with 15 likes should return 10361 likes
describe("totalLikes", () => {
  test("empty list returns 0", () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })

  test("a single blogpost with 10 likes returns 10", () => {
    const blogs = [
      {
        title: "2Cool Blog",
        author: "Diego Castillo",
        url: "http://bogus.xyz",
        likes: 10,
      },
    ]

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(10)
  })

  test("a list of blogposts with 10361 likes", () => {
    const blogs = [
      {
        title: "2Cool Blog",
        author: "Diego Castillo",
        url: "http://bogus.xyz",
        likes: 333,
      },
      {
        title: "Test Blog",
        author: "Sunny Log",
        url: "http://bogus.xyz",
        likes: 18,
      },
      {
        title: "2Cool Blog",
        author: "Dave Tendo",
        url: "http://bogus.xyz",
        likes: 10000,
      },
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(10351)
  })
})

describe("favoriteBlog", () => {
  test("an empty bloglist returns an empty object", () => {
    const blogs = []

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({})
  })
  test("a bloglist with one entry returns that entry", () => {
    const blogs = [
      {
        title: "2Cool Blog",
        author: "Diego Castillo",
        url: "http://bogus.xyz",
        likes: 333,
      },
    ]

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: "2Cool Blog",
      author: "Diego Castillo",
      url: "http://bogus.xyz",
      likes: 333,
    })
  })
  test("a bloglist with multiple entries returns the most liked entry", () => {
    const blogs = [
      {
        title: "2Cool Blog",
        author: "Diego Castillo",
        url: "http://bogus.xyz",
        likes: 333,
      },
      {
        title: "Test Blog",
        author: "Sunny Log",
        url: "http://bogus.xyz",
        likes: 1800,
      },
      {
        title: "2Cool Blog",
        author: "Dave Tendo",
        url: "http://bogus.xyz",
        likes: 14,
      },
    ]

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: "Test Blog",
      author: "Sunny Log",
      url: "http://bogus.xyz",
      likes: 1800,
    })
  })
})

describe("mostBlogs", () => {
  test("an empty bloglist returns an empty object", () => {
    const blogs = []

    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({})
  })

  test("a bloglist of 1 returns that author and blogs value of 1", () => {
    const blogs = [
      {
        title: "2Cool Blog",
        author: "Diego Castillo",
        url: "http://bogus.xyz",
        likes: 333,
      },
    ]

    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: "Diego Castillo",
      blogs: 1,
    })
  })

  test("a bloglist with a single author returns that author and number of blogs", () => {
    const blogs = [
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
        title: "Is Bloggin Wrong?",
        author: "Diego Castillo",
        url: "http://bogus.xyz",
        likes: 1,
      },
    ]

    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: "Diego Castillo",
      blogs: 3,
    })
  })

  test("a bloglist with multiple authors returns the author with the most blogs", () => {
    const blogs = [
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

    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: "Diego Castillo",
      blogs: 3,
    })
  })
})

describe("mostLikes", () => {
  test("an empty bloglist", () => {
    const blogs = []

    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({})
  })

  test("a bloglist of 1, with the correct number of likes", () => {
    const blogs = [
      {
        title: "Why Blog",
        author: "Diego Castillo",
        url: "http://bogus.xyz",
        likes: 15,
      },
    ]

    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: "Diego Castillo",
      likes: 15,
    })
  })

  test("a bloglist of multiple authors, with the correct author and sum of likes", () => {
    const blogs = [
      {
        title: "2Cool Blog",
        author: "Diego Castillo",
        url: "http://bogus.xyz",
        likes: 333,
      },
      {
        title: "Fire Blogging",
        author: "Dave Tendo",
        url: "http://bogus.xyz",
        likes: 282,
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
        likes: 182,
      },
      {
        title: "Frogs are weird",
        author: "Dave Tendo",
        url: "http://bogus.xyz",
        likes: 100,
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

    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: "Dave Tendo",
      likes: 410,
    })
  })
})
