import gql from 'graphql-tag';

export const GET_RECIPES = gql`
    query Recipes($recipeIds: [Int!]){
        recipes(recipeIds:$recipeIds){
            recipeId,
            name,
            ingredients,
            directions,
            imageUrl,
            creator {
                userId,
                firstName,
                lastName
            }
        }
    }`;