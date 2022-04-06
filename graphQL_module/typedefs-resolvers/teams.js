const { gql } = require('apollo-server')
const database = require('../database')

const typeDefs = gql`
    type Team {
        id: Int
        manager: String
        office: String
        extension_number: String
        mascot: String
        cleaning_duty: String
        project: String
    }
`

const resolvers = {
    Query: {
        teams: () => database.teams,

        team: (parent, args, context, info) => database.teams
            .filter(team => {
                return team.id === args.id
            })[0]
    },

    Mutation: {
        deleteTeam: (parent, args, context, info) => {
            const deleted = database.teams
                .filter(team => {
                    return team.id === args.id
                })[0];

            database.teams = database.teams
                .filter(team => {
                    return team.id !== args.id
                });

            return deleted
        },

        insertTeam: (parent, args, context, info) => {
            database.teams.push(args)
            return args
        },

        editTeam: (parent, args, context, info) => {
            return database.teams.filter(team => {
                return team.id === args.id
            }).map(team => {
                Object.assign(team, args)
                return team
            })[0]
        }
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}