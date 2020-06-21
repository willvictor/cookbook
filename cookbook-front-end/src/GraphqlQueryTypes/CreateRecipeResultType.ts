import { Recipe } from "./RecipeType";

export interface CreateRecipeResult {
    createRecipe: {
        userWasAuthenticated: boolean;
        createdRecipe: Recipe;
    }
}