import { RecipeType } from "../Types/RecipeType";
import { GraphQLList, GraphQLInt } from "graphql";
import { Recipe } from "../../../database/models/Recipe";
import { User } from "../../../database/models/User";
import { Op } from "sequelize";


export const recipes = {
    type: new GraphQLList(RecipeType),
    args: {
        recipeIds: {type: GraphQLList(GraphQLInt)},
    },
    resolve: async (root: any, args : any) => {
        let whereClause : any = !args.recipeIds 
            ? {} 
            : {recipeId : args.recipeIds};
        whereClause.dateDeleted = { 
            [Op.is]: null 
        };
        return await Recipe.findAll({ 
            include: [User], 
            where: whereClause
        });
    }
};