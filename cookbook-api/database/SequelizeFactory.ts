import {Sequelize} from 'sequelize-typescript';

export const getSequelizeInstance = () => new Sequelize({
  database: 'cookbook',
  dialect: 'postgres',
  username: 'postgres',
  password: process.env.CLOUD_SQL_DB_PWD || '',
  host: process.env.CLOUD_SQL_HOST || 'localhost:5432',
  models: [__dirname + '/models']
});
