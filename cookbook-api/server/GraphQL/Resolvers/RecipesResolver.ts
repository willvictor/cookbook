import { Op } from "sequelize";
import { Recipe } from "../../../database/models/Recipe";
import { User } from "../../../database/models/User";

export const RecipesResolver = async (parent: any, args: any, context: any) => {
  let whereClause: any = !args.recipeIds ? {} : { recipeId: args.recipeIds };
  whereClause.dateDeleted = {
    [Op.is]: null
  };
  return await Recipe.findAll({
    include: [User],
    where: whereClause
  });
};
