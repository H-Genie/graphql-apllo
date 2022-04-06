const { ApolloServer } = require('apollo-server')

const queries = require('./typedefs-resolvers/_queries')
const mutations = require('./typedefs-resolvers/_mutations')

const teams = require('./typedefs-resolvers/teams')
const equipments = require('./typedefs-resolvers/equipments')

const typeDefs = [
    queries,
    mutations,
    teams.typeDefs,
    equipments.typeDefs
]

const resolvers = [
    teams.resolvers,
    equipments.resolvers
]

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
})