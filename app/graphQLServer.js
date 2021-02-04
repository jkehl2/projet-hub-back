const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const resolver = require('./resolver');
const client = require('./dataSource/client');
const dataSources = require('./dataSource');


const graphQLServer = new ApolloServer({
    // On lui donne le schema
    typeDefs: schema,
    // et les resolvers
    resolvers: resolver,
    formatError: (err) => {
        //const error = getErrorCode(err.Message)
        return { message: err.message, id: 400 }
    },
    // J'injecte dans le "context" notre client sql
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