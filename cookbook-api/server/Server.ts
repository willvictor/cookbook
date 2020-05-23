import express from "express";
import graphqlHTTP from "express-graphql";
import {createSchema} from "./GraphQLSchema";
import session from "express-session";
import * as path from 'path';
import { nonExecutableDefinitionMessage } from "graphql/validation/rules/ExecutableDefinitions";

const app = express();

const schema = createSchema()

app.set('trust proxy', 1)

app.use(session({
  name: 'cookbook.sid',
  secret: 'testing-to-do-change-this-secret'
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