"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var graphql_sequelize_1 = require("graphql-sequelize");
var models = require("../database-migrations/models");
var createSchema = function () {
    var RecipeType = new graphql_1.GraphQLObjectType({
        name: 'Recipe',
        fields: function () { return ({
            id: { type: graphql_1.GraphQLInt },
            name: { type: graphql_1.GraphQLString },
            ingredients: { type: graphql_1.GraphQLString },
            directions: { type: graphql_1.GraphQLString },
        }); }
    });
    var QueryType = new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: function () { return ({
            recipe: {
                type: RecipeType,
                args: {
                    id: { type: graphql_1.GraphQLInt }
                },
                resolve: graphql_sequelize_1.resolver(models.Recipe)
            },
            recipes: {
                type: new graphql_1.GraphQLList(RecipeType),
                resolve: graphql_sequelize_1.resolver(models.Recipe)
            }
        }); }
    });
    return new graphql_1.GraphQLSchema({
        query: QueryType,
    });
};
exports.createSchema = createSchema;
