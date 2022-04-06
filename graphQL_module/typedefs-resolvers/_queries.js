const { gql } = require('apollo-server')

const typeDefs = gql`
    type Query {
        teams: [Team],
        team(id : Int) : Team

        equipments : [Equipment]
        equipment(id:String) : Equipment
    }
`

module.exports = typeDefs