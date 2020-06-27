import { User } from "../../../database/models/User";
import { OAuth2Client } from "google-auth-library";

export const LoginResolver = async (parent: any, args: any, context: any) => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID ||
      "984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com"
  );
  const ticket = await client.verifyIdToken({
    idToken: args.googleTokenId,
    audience:
      process.env.GOOGLE_CLIENT_ID ||
      "984941479252-maabsnngi084tun89leu7ts4otp1jldo.apps.googleusercontent.com"
  });
  const payload = ticket.getPayload();
  if (!payload) throw "payload should not be null";
  const [user] = await User.findOrCreate({
    where: { googleSubId: payload["sub"] },
    defaults: {
      firstName: payload["given_name"],
      lastName: payload["family_name"],
      email: payload["email"],
      imageUrl: payload["picture"],
      googleSubId: payload["sub"]
    }
  });
  context.session.isAuthenticated = true;
  context.session.userId = user.userId;
  return user;
};