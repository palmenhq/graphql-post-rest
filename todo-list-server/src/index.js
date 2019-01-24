
// github.com/palmfjord


const { makeExecutableSchema } =
  require('graphql-tools')
const { ApolloServer } = require('apollo-server')
const { GraphQLError} = require('graphql')

const typeDefs = `
type List {
  id: ID!
  name: String!
  listItems: [ListItem!]!
}

type ListItem {
  id: ID!
  what: String!
  who: String
}

type Query {
  # Tells us that stuff works
  ping: String!
  
  lists: [List!]!
  list(id: String!): List
}

type Mutation {
  addListItem(listId: String!, what: String!): ListItem!
}
`

const lists = [
  {
    id: "1",
    name: "First list of unicorns"
  },
  {
    id: "2",
    name: "Second list of pandas"
  }
]

const listItems = [
  {
    id: '100',
    what: 'Charlie',
    listId: '1',
  },
  {
    id: '200',
    what: 'Carl',
    listId: '1',
  }
]

const resolvers = {
  Query: {
    ping: async () => {
      return "OK"
    },
    lists: async () => {
      return lists
    },
    list: async (_root, params) => {
      return lists.find(list => list.id === params.id)
    }
  },
  Mutation: {
    addListItem: async (_root, params) => {
      if (
        !lists
          .map(list => list.id)
          .includes(params.listId)
      ) {
        throw new GraphQLError('List does not exist')
      }

      const listItem = {
        id: Math.floor(Math.random() * 42).toString(),
        listId: params.listId,
        what: params.what,
      }

      listItems.push(listItem)

      return listItem
    },
  },

  List: {
    listItems: async (list) => {
      return listItems.filter(
        (listItem) => listItem.listId === list.id
      )
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
})

const server = new ApolloServer({ schema })

server.listen(1337)
  .then(() => console.log('Server listening on port 1337 👂'))
