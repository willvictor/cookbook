import { GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLString } from 'graphql';
import { resolver } from "graphql-sequelize";
const models = require("../database-migrations/models");
const {OAuth2Client} = require('google-auth-library');



const createSchema = () => {
    const UserType = new GraphQLObjectType({
        name: 'User',
        fields: () => ({
            firstName: {type: GraphQLString},
            lastName: {type: GraphQLString},
            email: {type: GraphQLString},
            imageUrl: {type: GraphQLString},
            googleSubId: {type: GraphQLString}
        })
    });

    const RecipeType = new GraphQLObjectType({
        name: 'Recipe',
        fields: () => ({
            recipeId: {type: GraphQLInt},
            name: {type: GraphQLString},
            ingredients: {type: GraphQLString},
            directions: {type: GraphQLString},
            imageUrl: {type: GraphQLString},
            creator: { 
                type: UserType,
                resolve: resolver(models.Recipe.User)
            }
        })
    });
        
    const QueryType = new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            recipe: {
                type: RecipeType,
                args: {
                    recipeId: {type: GraphQLInt}
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
                    directions: {type: GraphQLString},
                    imageUrl: {type: GraphQLString},
                    userId: {type: GraphQLInt}
                },
                resolve: async (root, args) => {
                    const newRecipe = models.Recipe.build({
                        name: args.name,
                        ingredients: args.ingredients,
                        directions: args.directions,
                        imageUrl: args.imageUrl,
                        userId: root.session.userId
                    });
                    return await newRecipe.save();
                }
            },
            login: {
                type: UserType,
                args: {
                    googleTokenId: {type: GraphQLString},
                },
                resolve: async (root, args) => {
                    const client = new OAuth2Client("984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com");
                    const ticket = await client.verifyIdToken({
                        idToken: args.googleTokenId,
                        audience: "984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com",
                    });
                    const payload = ticket.getPayload();
                    const existingUsers = await models.User.findAll({
                        where: {
                            googleSubId: payload['sub']
                        }
                    });
                    let user;
                    if (existingUsers.length > 0){
                        user = existingUsers[0];
                    }
                    else{
                        const newUser = models.User.build({
                            firstName: payload['given_name'],
                            lastName: payload['family_name'],
                            email: payload['email'],
                            imageUrl: payload['picture'],
                            googleSubId: payload['sub']
                        });
                        await newUser.save();
                        user = newUser;
                    }
                    root.session.isAuthenticated = true;
                    root.session.userId = user.userId;
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