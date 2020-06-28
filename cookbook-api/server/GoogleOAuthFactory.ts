import { OAuth2Client } from "google-auth-library";

export const GetGoogleAuthClient = () =>
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID ||
      "984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com"
  );
