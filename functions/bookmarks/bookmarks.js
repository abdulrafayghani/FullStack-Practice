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
  id: String!
}

type Mutation {
  addBookmark(url: String!, desc: String!) : Bookmark
  deleteBookmark(id: String!) : Bookmark
}
`

const resolvers = {
  Query: {
    bookmark: async () => {
      const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })

      try{
        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('all_bookmarks'))),
            q.Lambda(x => q.Get(x))
            )
        )
            return result.data.map((d) => {
              return {
                url: d.data.url,
                desc: d.data.desc,
                id: d.ref.id,
              }
            } )
      } catch(err) {
        console.log(err)
      }
    },
  },
  Mutation: {
    addBookmark: async (_,{ url, desc }) => {

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
        return result.data
      } catch(err) {
        console.log(err)
      }
    },
    deleteBookmark: async (_, { id }) => {
      console.log(id)
      const client = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_SECRET })
      try {
        const result = await client.query(
          q.Delete(q.Ref(q.Collection('links'), id))
        )
      } catch (err) {
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
