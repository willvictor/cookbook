import { User } from "./UserType";

export interface Recipe {
  recipeId: number;
  name: string;
  ingredients: string;
  directions: string;
  imageUrl: string;
  creator: User;
}
