import gql from 'graphql-tag';

export const DELETE_RECIPE = gql`
    mutation DeleteRecipe($recipeDetailId: Int){
        deleteRecipe(recipeId:$recipeDetailId)
    }`;