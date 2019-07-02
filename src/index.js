const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');
const Vote = require('./resolvers/Vote');
//implementation of the schema
const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote
};

//create the server and pass in the schema and resolvers
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        //add request object to context to allow resolvers to read Auth header and validate the user
        return {
            ...request,
            prisma
        }
    }
})
server.start(() => console.log('Server is running on http://localhost:4000'))