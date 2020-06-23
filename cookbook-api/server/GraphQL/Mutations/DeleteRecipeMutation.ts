import { GraphQLInt, GraphQLEnumType } from "graphql";
import { Recipe } from "../../../database/models/Recipe";

enum deleteRecipeResult {
    successfullyDeleted = 1,
    recipeIdNotValid = 2,
    notLoggedIn = 3,
    sessionUserIsNotCreator = 4,
};

export const deleteRecipe =  {
    type: GraphQLInt,
    args: {
        recipeId: {type: GraphQLInt},
    },
    resolve: async (root : any, args : any) => {
        const recipe = await Recipe.findByPk(args.recipeId);
        if (!root.session.isAuthenticated){
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
        return deleteRecipeResult.successfullyDeleted;
    }
}