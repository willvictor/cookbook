# cookbook
A web application for Chris D and Will V's recipes. Includes:
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
