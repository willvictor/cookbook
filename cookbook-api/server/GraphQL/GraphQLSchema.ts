import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { RecipeType } from "./Types/RecipeType";
import { UserType } from "./Types/UserType";
import { RecipesResolver } from "./Resolvers/RecipesResolver";
import { GoogleClientIdResolver } from "./Resolvers/GoogleClientIdResolver";
import { SessionUserResolver } from "./Resolvers/SessionUserResolver";
import { CreateRecipeResolver } from "./Resolvers/CreateRecipeResolver";
import { LoginResolver } from "./Resolvers/LoginResolver";
import { DeleteRecipeResolver } from "./Resolvers/DeleteRecipeResolver";

const baseTypeDefs = gql`
  type Query {
    recipes(recipeIds: [Int]): [Recipe]
    googleClientId: String
    sessionUser: User
  }
  type Mutation {
    createRecipe(
      name: String
      ingredients: String
      directions: String
      imageUrl: String
    ): Recipe
    login(googleTokenId: String): User
    deleteRecipe(recipeId: Int): Int
  }
`;

export const schema = makeExecutableSchema({
  typeDefs: [baseTypeDefs, RecipeType, UserType],
  resolvers: {
    Query: {
      recipes: RecipesResolver,
      googleClientId: GoogleClientIdResolver,
      sessionUser: SessionUserResolver
    },
    Mutation: {
      createRecipe: CreateRecipeResolver,
      login: LoginResolver,
      deleteRecipe: DeleteRecipeResolver
    }
  }
});
