import { GraphQLString, GraphQLObjectType, GraphQLBoolean, GraphQLInt } from "graphql";
import {RecipeType} from '../Types/RecipeType';
import { Recipe } from "../../../database/models/Recipe";
import { User } from "../../../database/models/User";

export const createRecipe = {
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
    resolve: async (root : any, args : any) => {
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
}