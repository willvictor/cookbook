# cookbook
A web application for Chris D and Will V's recipes. Built using:
1. A node.js (express) backend API 

    a. using graphql (express-graphql) as a declarative API query language to reduce API footprint for common data fetching and creation

2. A create-react-app front end
    
    a. using apollo client for middleware and state management
    
    b. uses react hooks :)
    
    c. uses google material-ui for a UI design system
    
3. A postgres database
    
    a. using sequelize as an ORM + database migrations utility.
    
    b. sequelize integrates with graphql via the library graphql-sequelize which creates default graphql resolvers for domain object definitions defined by sequelize. Thus, no need to write resolvers!
    
This app is still pretty far away from being deployed, but right now it's on good ground to take off!

# how to run the app locally:
1. *create a postgres db server locally* (eventually, we will hopefully have a remote db that we can connect to with a local proxy, but this is the world we're in for now).
    a. make sure the server has a db named cookbook.
    b. make sure the server has a user named postgres with no password
2. make sure you have `npm` installed on your machine and updated.
3. pull the repo, and run `cd cookbook-api`. Then run `npm install` (this should install all packages for the cookbook api).
4. now `cd ../cookbook-front-end`. Then run `npm install`. (should install all packages for the cookbook-front-end).
5. run dbup: `cd cookbook-api` and `npm run dbup`
6. run the cookbook-api server within `cookbook-api` run `npm dev`
7. in a new tab, change directories to `cookbook-front-end` and run `npm start`
8. go to localhost:3000/ and hopefully you see the app (with no recipes yet!) try adding some recipes and seeing if the app works!
 
