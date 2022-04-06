const { gql } = require('apollo-server')

const typeDefs = gql`
    type Mutation {
        deleteTeam(id : Int) : Team

        insertTeam(
            id: Int
            manager: String
            office: String
            extension_number: String
            mascot: String
            cleaning_duty: String
            project: String
        ) : Team

        editTeam(
            id: Int
            manager: String
            office: String
            extension_number: String
            mascot: String
            cleaning_duty: String
            project: String
        ) : Team

        deleteEquipment(id : String) : Equipment

        insertEquipment(
            id : String
            used_by : String
            count : Int
            new_or_used : String
        ) : Equipment

        editEquipment(
            id : String
            used_by : String
            count : Int
            new_or_used : String
        ) : Equipment
    }
`

module.exports = typeDefs