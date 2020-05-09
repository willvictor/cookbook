import express from "express";
import graphqlHTTP from "express-graphql";
import {createSchema} from "./GraphQLSchema";
import session from "express-session";

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
    graphiql: true,
  })),
);

app.get("/hello", (req, res) => {
  res.send("Hello world!");
})

app.listen(process.env.PORT || 2000);