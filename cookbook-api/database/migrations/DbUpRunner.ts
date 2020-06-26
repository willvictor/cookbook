import { initalizeSequelizeInstance } from "../SequelizeFactory";
import { runDbUp } from "./DbUpFactory";

const sequelize = initalizeSequelizeInstance();
runDbUp(sequelize);

