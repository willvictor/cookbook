import express from "express";
import graphqlHTTP from "express-graphql";
import {createSchema} from "./GraphQLSchema";
import session from "express-session";
import * as path from 'path';
const pgSession = require('connect-pg-simple')(session);
import {Pool} from 'pg';

const app = express();

const schema = createSchema()

app.set('trust proxy', 1)

app.use(session({
  store: new pgSession({
    pool: new Pool({
      database: 'cookbook',
      user: 'postgres',
      password: process.env.CLOUD_SQL_DB_PWD || '',
      host: process.env.CLOUD_SQL_HOST || 'localhost',
    })
  }),
  name: 'cookbook.sid',
  secret: process.env.SESSION_SECRET || 'local-host-dummy-secret',
  cookie: {
    maxAge: 4.32e5 /* 5 days */
  }
}));

app.use(
  '/graphql',
  graphqlHTTP(request => ({
    schema: schema,
    rootValue: request,
    graphiql: false,
  })),
);

//in production, this serves the create react app.
app.use(express.static(path.join(__dirname, '../build')))

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
})

app.listen(process.env.PORT || 2000);