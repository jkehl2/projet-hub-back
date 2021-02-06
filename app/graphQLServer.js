const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const resolver = require('./resolver');
const client = require('./dataSource/client');
const dataSources = require('./dataSource');


const graphQLServer = new ApolloServer({
    typeDefs: schema,
    resolvers: resolver,
    context: ({ req,res }) => {
        if (res.locals.user)
            return {
                sqlClient: client,
                user: res.locals.user
            };
        if (res.locals.tokenError)
            return {
                    sqlClient: client,
                    error: res.locals.tokenError, 
                    code: 9
            };
    },
    dataSources: () => {
        return dataSources;
    }
});



module.exports = graphQLServer