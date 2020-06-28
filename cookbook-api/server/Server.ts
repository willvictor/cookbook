import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { schema } from "./GraphQL/GraphQLSchema";
import session from "express-session";
import * as path from "path";
const pgSession = require("connect-pg-simple")(session);
import { Pool } from "pg";
import { initalizeSequelizeInstance } from "../database/SequelizeFactory";

const app = express();
initalizeSequelizeInstance();

app.set("trust proxy", 1);

app.use(
  session({
    store: new pgSession({
      pool: new Pool({
        database: "cookbook",
        user: "postgres",
        password: process.env.CLOUD_SQL_DB_PWD || "",
        host: process.env.CLOUD_SQL_HOST || "localhost"
      })
    }),
    name: "cookbook.sid",
    secret: process.env.SESSION_SECRET || "local-host-dummy-secret",
    cookie: {
      maxAge: 4.32e5 /* 5 days */
    }
  })
);

const server = new ApolloServer({
  schema: schema,
  context: async ({ req }) => req
});
server.applyMiddleware({ app });

//in production, this serves the create react app.
app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(process.env.PORT || 2000);
