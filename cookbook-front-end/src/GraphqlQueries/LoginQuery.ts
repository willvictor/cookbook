import gql from 'graphql-tag';

export const LOGIN = gql`
    mutation Login($googleTokenId: String!){
        login(googleTokenId:$googleTokenId){
            userId,
            firstName,
            lastName,
            imageUrl
        }
    }`; 