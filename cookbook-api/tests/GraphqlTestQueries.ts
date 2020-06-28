export const RECIPES = `
  query Recipes($recipeIds: [Int!]) {
    recipes(recipeIds: $recipeIds) {
      recipeId
      name
      ingredients
      directions
      imageUrl
      creator {
        userId
        firstName
        lastName
      }
    }
  }
`;

export const LOGIN = `mutation Login($googleTokenId: String!) {
  login(googleTokenId: $googleTokenId) {
    userId
    firstName
    lastName
    imageUrl
  }
}`;

export const CREATE_RECIPE = `
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
    imageUrl
    creator {
      firstName
      lastName
    }
  }
}
`;

export const DELETE_RECIPE = `
mutation DeleteRecipe($recipeId: Int) {
  deleteRecipe(recipeId: $recipeId)
}
`;
