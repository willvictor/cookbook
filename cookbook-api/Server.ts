import express from "express";

const app: express.Application = express();

app.get("/", (request, response) => {
    response.send("Hello world");
})

app.listen(2000, () => {
    console.log("Cookbook server is listening on port 2000");
})