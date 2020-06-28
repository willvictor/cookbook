import { Recipe } from "../../../database/models/Recipe";
import { User } from "../../../database/models/User";

export enum deleteRecipeResult {
  successfullyDeleted = 1,
  recipeIdNotValid = 2,
  notLoggedIn = 3,
  sessionUserIsNotCreator = 4
}

export const DeleteRecipeResolver = async (
  parent: any,
  args: any,
  context: any
) => {
  const recipe = await Recipe.findByPk(args.recipeId, { include: [User] });
  console.log(recipe);
  if (!context.session.isAuthenticated) {
    return deleteRecipeResult.notLoggedIn;
  }
  if (!recipe) {
    return deleteRecipeResult.recipeIdNotValid;
  }
  if (recipe.creatorId !== context.session.userId && !recipe.creator.isAdmin) {
    return deleteRecipeResult.sessionUserIsNotCreator;
  }
  recipe.dateDeleted = new Date();
  await recipe.save();
  return deleteRecipeResult.successfullyDeleted;
};
