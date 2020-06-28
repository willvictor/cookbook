import { Sequelize } from "sequelize-typescript";
import { runDbUp } from "../database/migrations/DbUpFactory";

//Create a database on localhost postgres instance called cookbooktest
//
export const SetupTestDatabase = async () => {
  const createTestDbSequelize = new Sequelize({
    database: "postgres",
    dialect: "postgres",
    username: "postgres",
    password: "",
    host: "localhost"
  });

  await createTestDbSequelize.query("CREATE DATABASE cookbooktest;");
  await createTestDbSequelize.close();
};

export const RunDbUpOnTestDb = async () => {
  const dbupSequelize = new Sequelize({
    database: "cookbooktest",
    dialect: "postgres",
    username: "postgres",
    password: "",
    host: "localhost"
  });
  await runDbUp(dbupSequelize);
  await dbupSequelize.close();
};

export const TearDownTestDatabase = async () => {
  const dropDbSequelize = new Sequelize({
    database: "postgres",
    dialect: "postgres",
    username: "postgres",
    password: "",
    host: "localhost"
  });
  await dropDbSequelize.query("DROP DATABASE cookbooktest");
  await dropDbSequelize.close();
};

export const GetTestSequelize = () =>
  new Sequelize({
    database: "cookbooktest",
    dialect: "postgres",
    username: "postgres",
    password: "",
    host: "localhost",
    models: [__dirname + "/../database/models"]
  });
