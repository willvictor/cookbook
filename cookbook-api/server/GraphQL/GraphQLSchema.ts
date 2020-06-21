import { GraphQLObjectType,
    GraphQLSchema} from 'graphql';
import { recipes } from './Queries/RecipesQuery';
import { googleClientId } from './Queries/GoogleClientIdQuery';
import { sessionUser } from './Queries/SessionQuery';
import {createRecipe} from './Mutations/CreateRecipeMutation';
import {login} from './Mutations/LoginMutation';
import {deleteRecipe} from './Mutations/DeleteRecipeMutation';

const createSchema = () => {    
    const QueryType = new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            recipes: recipes,
            googleClientId: googleClientId,
            sessionUser: sessionUser
        })
    });

    const MutationType = new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
            createRecipe: createRecipe,
            login: login,
            deleteRecipe: deleteRecipe
        })
    });
        
    return new GraphQLSchema({
        query: QueryType,
        mutation: MutationType
    });
};

export {createSchema};