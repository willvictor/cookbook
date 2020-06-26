import { Sequelize } from "sequelize-typescript";
import { runDbUp } from "../database/migrations/DbUpFactory";
import 'jest';

beforeEach(async () => {
  const createTestDbSequelize = new Sequelize({
    database: 'postgres',
    dialect: 'postgres',
    username: 'postgres',
    password: process.env.TEST_DB_PWD || '',
    host: 'localhost'
  });

  await createTestDbSequelize.query("CREATE DATABASE cookbooktest;");
  await createTestDbSequelize.close();

  const dbupSequelize = new Sequelize({
    database: 'cookbooktest',
    dialect: 'postgres',
    username: 'postgres',
    password: process.env.TEST_DB_PWD || '',
    host: 'localhost'
  });
  await runDbUp(dbupSequelize);
  await dbupSequelize.close();
});

afterEach(async () => {
  const dropDbSequelize = new Sequelize({
    database: 'postgres',
    dialect: 'postgres',
    username: 'postgres',
    password: process.env.TEST_DB_PWD || '',
    host: 'localhost'
  });
  await dropDbSequelize.query("DROP DATABASE cookbooktest");
  await dropDbSequelize.close();
});

test('hasRecipesTable', async () => {
  const testSequelize = new Sequelize({
    database: 'cookbooktest',
    dialect: 'postgres',
    username: 'postgres',
    password: process.env.TEST_DB_PWD || '',
    host: 'localhost'
  });
  const [data] = await testSequelize.query(`
    SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE  table_schema = 'public'
    AND    table_name   = 'recipes')`) as any;
  expect(data[0].exists).toBe(true);
  await testSequelize.close();
});

