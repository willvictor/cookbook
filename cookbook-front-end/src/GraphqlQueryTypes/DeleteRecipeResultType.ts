export enum DeleteRecipeResult {
  successfullyDeleted = 1,
  recipeIdNotValid = 2,
  notLoggedIn = 3,
  sessionUserIsNotCreator = 4
}

export interface DeleteRecipeResultType {
  deleteRecipe: DeleteRecipeResult;
}
