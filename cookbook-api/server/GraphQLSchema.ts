import { GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLString } from 'graphql';
import { resolver } from "graphql-sequelize";
const models = require("../database-migrations/models");



const createSchema = () => {
    const RecipeType = new GraphQLObjectType({
        name: 'Recipe',
        fields: () => ({
            id: {type: GraphQLInt},
            name: {type: GraphQLString},
            ingredients: {type: GraphQLString},
            directions: {type: GraphQLString},
        })
    });
        
    const QueryType = new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            recipe: {
                type: RecipeType,
                args: {
                    id: {type: GraphQLInt}
                },
                resolve: resolver(models.Recipe)
            }, 
            recipes: {
                type: new GraphQLList(RecipeType),
                resolve: resolver(models.Recipe)
            }
        })
    });

    const MutationType = new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
            createRecipe: {
                type: RecipeType,
                args: {
                  name: {type: GraphQLString},
                  ingredients: {type: GraphQLString},
                  directions: {type: GraphQLString}
                },
                resolve: async (root, args) => {
                  const newRecipe = models.Recipe.build({
                      name: args.name,
                      ingredients: args.ingredients,
                      directions: args.directions
                  });
                  return await newRecipe.save();
                }
            }
        })
    });
        
    return new GraphQLSchema({
        query: QueryType,
        mutation: MutationType
    });
};

export {createSchema};