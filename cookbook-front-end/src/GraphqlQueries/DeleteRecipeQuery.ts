import gql from "graphql-tag";

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($recipeId: Int) {
    deleteRecipe(recipeId: $recipeId)
  }
`;
