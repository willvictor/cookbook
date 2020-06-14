import { GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLString, 
    GraphQLBoolean} from 'graphql';
import {getSequelizeInstance} from '../database/SequelizeFactory';
import { User } from '../database/models/User';
import { Recipe } from '../database/models/Recipe';
import {OAuth2Client} from 'google-auth-library';

const sequelize = getSequelizeInstance();

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
            creator: { type: UserType }
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
                resolve: async (root, args) => {
                    return await Recipe.findByPk(args.recipeId, {include: [User]});
                }
            }, 
            recipes: {
                type: new GraphQLList(RecipeType),
                resolve: async (root, args) => {
                    return await Recipe.findAll({include: [User]});
                }
            },
            googleClientId: {
                type: GraphQLString,
                resolve: () => process.env.GOOGLE_CLIENT_ID || "984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com"
            },
            sessionUser: {
                type: UserType,
                resolve: async (root) => {
                    if (!root.session.isAuthenticated){
                        return null;
                    }
                    return await User.findByPk(root.session.userId);
                }
            }
        })
    });

    const MutationType = new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
            createRecipe: {
                type: new GraphQLObjectType({
                    name: "CreateRecipeResult",
                    fields: () => ({
                        userWasAuthenticated: {type: GraphQLBoolean},
                        createdRecipe: {type: RecipeType},
                    })
                }),
                args: {
                    name: {type: GraphQLString},
                    ingredients: {type: GraphQLString},
                    directions: {type: GraphQLString},
                    imageUrl: {type: GraphQLString},
                    creatorId: {type: GraphQLInt}
                },
                resolve: async (root, args) => {
                    if (!root.session.isAuthenticated){
                        return {
                            userWasAuthenticated: false,
                            createdRecipe: null
                        }
                    }
                    const newRecipe = Recipe.build({
                        name: args.name,
                        ingredients: args.ingredients,
                        directions: args.directions,
                        imageUrl: args.imageUrl,
                        creatorId: root.session.userId
                    });
                    const recipe = await newRecipe.save();
                    const recipeWithUser = await Recipe.findByPk(recipe.recipeId, {include: [User]});
                    return {
                        userWasAuthenticated: true,
                        createdRecipe: recipeWithUser
                    };
                }
            },
            login: {
                type: UserType,
                args: {
                    googleTokenId: {type: GraphQLString},
                },
                resolve: async (root, args) => {
                    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com");
                    const ticket = await client.verifyIdToken({
                        idToken: args.googleTokenId,
                        audience: process.env.GOOGLE_CLIENT_ID || "984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com",
                    });
                    const payload = ticket.getPayload();
                    if (!payload) throw "payload should not be null";
                    const [user, created] = await User.findOrCreate({
                        where: { googleSubId: payload['sub'] },
                        defaults: {
                            firstName: payload['given_name'],
                            lastName: payload['family_name'],
                            email: payload['email'],
                            imageUrl: payload['picture'],
                            googleSubId: payload['sub']
                        }
                    });
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