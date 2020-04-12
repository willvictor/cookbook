import express from "express";
import graphqlHTTP from "express-graphql";
import {createSchema} from "./GraphQLSchema";

const app = express();

const schema = createSchema()

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);

app.listen(2000);