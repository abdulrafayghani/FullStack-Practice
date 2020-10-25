const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
q = faunadb.query
require('dotenv').config()


const typeDefs = gql`
type Query {
  bookmark: [Bookmark!]
}

type Bookmark {
  id: ID!
  url: String!
  desc: String!
}

type Mutation {
  addBookmark : Bookmark
}
`

const authors = [
  { id: 1, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
  { id: 2, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
  { id: 3, url: 'https://github.com/gatsbyjs/gatsby-starter-hello-world', desc: "this is a github gatsby official repository" },
]

const resolvers = {
  Query: {
    bookmark: async () => {
      return authors
      // const client = await faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

      // try{
      //   const result = client.query(
      //     q.Create(q.Ref(q.Collection('links'), authors))
      //   )
      //   // console.log("Document Created and Inserted in Container: " + result.ref.id);
      // } catch(err) {
      //   console.log(err)
      // }
    },
  },
  Mutation: {
    addBookmark: async () => {
      const client = await faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

      try{
        const result = client.query(
          q.Create(q.Ref(q.Collection('links'), authors))
        )
        console.log("Document Created and Inserted in Container: " + result.ref.id);
      } catch(err) {
        console.log(err)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
