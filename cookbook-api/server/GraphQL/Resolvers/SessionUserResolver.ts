import { User } from "../../../database/models/User";

export const SessionUserResolver = async (parent: any, args : any, context: any) => {
    console.log(context);
    if (!context.session || !context.session.isAuthenticated || !context.session.userId){
        return null;
    }
    return await User.findByPk(context.session.userId);
}