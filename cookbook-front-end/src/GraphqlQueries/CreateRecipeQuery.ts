import gql from 'graphql-tag';

export const CREATE_RECIPE = gql`
    mutation CreateRecipe($name: String!, $directions: String!, $ingredients: String!, $imageUrl: String){
        createRecipe(name:$name, directions:$directions, ingredients: $ingredients, imageUrl: $imageUrl){
            userWasAuthenticated,
            createdRecipe{
                recipeId,
                name,
                imageUrl,
                creator {
                    firstName,
                    lastName
                }
            }
        }
    }`; 