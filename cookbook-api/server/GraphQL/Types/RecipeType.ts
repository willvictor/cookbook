import {gql} from "apollo-server-express"

export const RecipeType = gql`
    type Recipe {
        recipeId: Int,
        name: String,
        ingredients: String,
        directions: String,
        imageUrl: String,
        creator: User
    }`;