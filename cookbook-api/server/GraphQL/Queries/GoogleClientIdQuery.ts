import { GraphQLString } from "graphql";

export const googleClientId =  {
    type: GraphQLString,
    resolve: () => process.env.GOOGLE_CLIENT_ID || "984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com"
};