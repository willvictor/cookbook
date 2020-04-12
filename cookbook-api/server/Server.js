"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_graphql_1 = __importDefault(require("express-graphql"));
var GraphQLSchema_1 = require("./GraphQLSchema");
var app = express_1.default();
var schema = GraphQLSchema_1.createSchema();
app.use('/graphql', express_graphql_1.default({
    schema: schema,
    graphiql: true,
}));
app.listen(2000);
