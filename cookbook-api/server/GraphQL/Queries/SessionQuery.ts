import { UserType } from "../Types/UserType";
import { User } from "../../../database/models/User";

export const sessionUser = {
    type: UserType,
    resolve: async (root: any) => {
        if (!root.session || !root.session.isAuthenticated || !root.session.userId){
            return null;
        }
        return await User.findByPk(root.session.userId);
    }
}