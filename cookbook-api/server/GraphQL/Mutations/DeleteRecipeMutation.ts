import { GraphQLBoolean, GraphQLInt } from "graphql";
import { Recipe } from "../../../database/models/Recipe";

enum deleteRecipeResult {
    recipeIdNotValid = 1,
    notLoggedIn = 2,
    sessionUserIsNotCreator = 3,

};

export const deleteRecipe =  {
    type: GraphQLBoolean,
    args: {
        recipeId: {type: GraphQLInt},
    },
    resolve: async (root : any, args : any) => {
        const recipe = await Recipe.findByPk(args.recipeId);
        if (!root.isAuthenticated){
            return deleteRecipeResult.notLoggedIn;
        }
        if (!recipe){
            return deleteRecipeResult.recipeIdNotValid;
        }
        if (recipe.creatorId !== root.session.userId){
            return deleteRecipeResult.sessionUserIsNotCreator;
        }
        recipe.dateDeleted = new Date();
        await recipe.save();
        return true;
    }
}