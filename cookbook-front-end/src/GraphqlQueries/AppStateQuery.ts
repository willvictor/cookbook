import gql from "graphql-tag";

export const GET_APP_STATE = gql`
  query SessionInfo {
    sessionUser {
      userId
      firstName
      lastName
      imageUrl
    }
    googleClientId
    deletedRecipeToastIsOpen @client
  }
`;
