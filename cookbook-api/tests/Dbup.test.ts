import { Sequelize } from "sequelize-typescript";
import "jest";
import {
  SetupTestDatabase,
  TearDownTestDatabase,
  RunDbUpOnTestDb
} from "./TestUtilties";

beforeEach(async () => {
  await SetupTestDatabase();
});

afterEach(async () => {
  await TearDownTestDatabase();
});

test("Db up runs successfully", async () => {
  //Run DBUP on the DB
  RunDbUpOnTestDb();

  //confirm a few things about the tables on the DB
  const testSequelize = new Sequelize({
    database: "cookbooktest",
    dialect: "postgres",
    username: "postgres",
    password: process.env.TEST_DB_PWD || "",
    host: "localhost"
  });

  //recipes exists
  let [data] = (await testSequelize.query(`
    SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE  table_schema = 'public'
    AND    table_name   = 'recipes')`)) as any;
  expect(data[0].exists).toBe(true);

  //users exists
  [data] = (await testSequelize.query(`
    SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE  table_schema = 'public'
    AND    table_name   = 'users')`)) as any;
  expect(data[0].exists).toBe(true);

  await testSequelize.close();
});
