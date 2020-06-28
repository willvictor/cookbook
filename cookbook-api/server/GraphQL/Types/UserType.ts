import { gql } from "apollo-server-express";

export const UserType = gql`
  type User {
    userId: Int
    firstName: String
    lastName: String
    email: String
    imageUrl: String
    googleSubId: String
  }
`;
