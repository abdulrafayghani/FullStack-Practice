const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
q = faunadb.query
require('dotenv').config()


const typeDefs = gql`
type Query {
  bookmark: [Bookmark!]
}

type Bookmark {
  url: String!
  desc: String!
}

type Mutation {
  addBookmark(url: String!, desc: String!) : Bookmark
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
      const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

      try{
        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('url'))),
            q.Lambda(x => q.Get(x))
            )
        )
            return result.data.map((d) => {
              return {
                // id: d.ts,
                url: d.data.url,
                // desc: d.desc
              }
            } )
      } catch(err) {
        console.log(err)
      }
    },
  },
  Mutation: {
    addBookmark: async (_,{ url, desc }) => {
      console.log('server url', url)

      const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })
      try{
        const result = await client.query(
          q.Create(
            q.Collection('links'),
            { data: { 
              url, 
              desc
             } 
            },
          )
        )
        console.log(result.data)
        // console.log("Document Created and Inserted in Container: " + result.ref.id);
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
