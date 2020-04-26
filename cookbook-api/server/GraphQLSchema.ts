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
    const UserType = new GraphQLObjectType({
        name: 'User',
        fields: () => ({
            firstName: {type: GraphQLString},
            lastName: {type: GraphQLString},
            email: {type: GraphQLString},
            imageUrl: {type: GraphQLString},
            google_token_id: {type: GraphQLString}
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
            },
            login: {
                type: UserType,
                args: {
                    googleTokenId: {type: GraphQLString},
                    firstName: {type: GraphQLString},
                    lastName: {type: GraphQLString},
                    email: {type: GraphQLString},
                    imageUrl: {type: GraphQLString},
                },
                resolve: async (root, args) => {
                    const existingUsers = models.User.findAll({
                        where: {
                            googleTokenId: args.googleTokenId
                        }
                    });
                    let user;
                    if (existingUsers.length > 0){
                        user = existingUsers[0];
                    }
                    else{
                        const newUser = models.User.build({
                            firstName: args.firstName,
                            lastName: args.lastName,
                            email: args.email,
                            imageUrl: args.imageUrl,
                            googleTokenId: args.googleTokenId
                        });
                        await newUser.save();
                        user = newUser;
                    }
                    root.session.isAuthenticated = true;
                    root.userId = user.id;
                    return user;
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