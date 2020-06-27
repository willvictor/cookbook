import { Sequelize } from "sequelize-typescript";
import "jest";
import { SetupTestDatabase, TearDownTestDatabase } from "./TestUtilties";

beforeEach(async () => {
  await SetupTestDatabase();
});

afterEach(async () => {
  await TearDownTestDatabase();
});

test("hasRecipesTable", async () => {
  const testSequelize = new Sequelize({
    database: "cookbooktest",
    dialect: "postgres",
    username: "postgres",
    password: process.env.TEST_DB_PWD || "",
    host: "localhost"
  });
  const [data] = (await testSequelize.query(`
    SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE  table_schema = 'public'
    AND    table_name   = 'recipes')`)) as any;
  expect(data[0].exists).toBe(true);
  await testSequelize.close();
});
