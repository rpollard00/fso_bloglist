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
