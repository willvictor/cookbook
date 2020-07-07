import { User } from "./UserType";

export interface AppState {
  sessionUser: User | null;
  googleClientId: string;
  deletedRecipeToastIsOpen: boolean;
}
