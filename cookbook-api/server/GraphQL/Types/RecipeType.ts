import { GraphQLObjectType,
    GraphQLInt,
    GraphQLString} from 'graphql';
import { UserType } from './UserType';


export const RecipeType = new GraphQLObjectType({
    name: 'Recipe',
    fields: () => ({
        recipeId: {type: GraphQLInt},
        name: {type: GraphQLString},
        ingredients: {type: GraphQLString},
        directions: {type: GraphQLString},
        imageUrl: {type: GraphQLString},
        creator: { type: UserType }
    })
});