import { Recipe } from "../../../database/models/Recipe";
import { User } from "../../../database/models/User";

export const CreateRecipeResolver = async (
  parent: any,
  args: any,
  context: any
) => {
  if (!context.session.isAuthenticated) {
    return null;
  }
  const newRecipe = Recipe.build({
    name: args.name,
    ingredients: args.ingredients,
    directions: args.directions,
    imageUrl: args.imageUrl,
    creatorId: context.session.userId
  });
  const recipe = await newRecipe.save();
  const recipeWithUser = await Recipe.findByPk(recipe.recipeId, {
    include: [User]
  });
  return recipeWithUser;
};
