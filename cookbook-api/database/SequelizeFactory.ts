import {Sequelize} from 'sequelize-typescript';

export const getSequelizeInstance = () => new Sequelize({
  database: 'cookbook',
  dialect: 'postgres',
  username: 'postgres',
  password: '',
  models: [__dirname + '/models']
});
