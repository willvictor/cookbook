import { User } from "./UserType";

export interface AppState {
  sessionUser: User;
  googleClientId: string;
  deletedRecipeToastIsOpen: boolean;
}
