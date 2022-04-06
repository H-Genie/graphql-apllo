const { gql } = require('apollo-server')
const database = require('../database')

const typeDefs = gql`
    type Equipment {
        id : String
        used_by : String
        count : Int
        new_or_used : String
    }
`

const resolvers = {
    Query: {
        equipments: () => database.equipments,

        equipment: (parent, args, context, info) => database.equipments
            .filter(equipment => {
                return equipment.id === args.id
            })[0]
    },

    Mutation: {
        deleteEquipment: (parent, args, context, info) => {
            const deleted = database.equipments
                .filter(equipment => {
                    return equipment.id === args.id
                })[0];

            database.equipments = database.equipments
                .filter(equipment => {
                    return equipment.id !== args.id
                });

            return deleted
        },

        insertEquipment: (parent, args, context, info) => {
            database.equipments.push(args);
            return args;
        },

        editEquipment: (parent, args, context, info) => {
            return database.equipments.filter(equipment => {
                return equipment.id === args.id
            }).map(equipment => {
                Object.assign(equipment, args);
                return equipment
            })[0]
        }
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}