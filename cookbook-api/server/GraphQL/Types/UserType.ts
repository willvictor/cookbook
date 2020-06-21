import { GraphQLObjectType,
    GraphQLInt,
    GraphQLString} from 'graphql';

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        userId: {type: GraphQLInt},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString},
        imageUrl: {type: GraphQLString},
        googleSubId: {type: GraphQLString}
    })
});