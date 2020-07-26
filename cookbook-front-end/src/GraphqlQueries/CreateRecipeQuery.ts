import gql from "graphql-tag";

export const CREATE_RECIPE = gql`
  mutation CreateRecipe(
    $name: String!
    $directions: String!
    $ingredients: String!
    $imageUrl: String
  ) {
    createRecipe(
      name: $name
      directions: $directions
      ingredients: $ingredients
      imageUrl: $imageUrl
    ) {
      recipeId
      name
      directions
      ingredients
      imageUrl
      creator {
        userId
        firstName
        lastName
      }
    }
  }
`;
