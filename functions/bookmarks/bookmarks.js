const { ApolloServer, gql } = require('apollo-server-lambda')

const typeDefs = gql`
type Query {
  bookmark: [Bookmark!]
}

type Bookmark {
  id: ID!
  url: String!
  desc: String!
}
`

const authors = [
  { id: 1, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
  { id: 2, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
  { id: 3, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
]

const resolvers = {
  Query: {
    bookmark: () => {
      return authors
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
