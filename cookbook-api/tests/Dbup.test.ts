import "jest";
import {
  SetupTestDatabase,
  TearDownTestDatabase,
  RunDbUpOnTestDb,
  GetTestSequelize
} from "./TestUtilties";
import { Sequelize } from "sequelize";

let testSequelize: Sequelize;
beforeAll(async () => {
  await SetupTestDatabase();
});

afterAll(async () => {
  await TearDownTestDatabase();
});

beforeEach(() => {
  //confirm a few things about the tables on the DB
  testSequelize = GetTestSequelize();
});

afterEach(() => {
  if (testSequelize) {
    testSequelize.close();
  }
});

describe("DbUp", async () => {
  test("Db up runs successfully", async () => {
    //Run DBUP on the DB
    await RunDbUpOnTestDb();
  });

  test("Has recipes table", async () => {
    let [data] = (await testSequelize.query(`
      SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_schema = 'public'
      AND    table_name   = 'recipes')`)) as any;
    expect(data[0].exists).toBe(true);
  });

  test("Has users table", async () => {
    let [data] = (await testSequelize.query(`
    SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE  table_schema = 'public'
    AND    table_name   = 'users')`)) as any;
    expect(data[0].exists).toBe(true);
  });

  test("Has ratings table", async () => {
    let [data] = (await testSequelize.query(`
    SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE  table_schema = 'public'
    AND    table_name   = 'recipe_ratings')`)) as any;
    expect(data[0].exists).toBe(true);
  });
});
