require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const resolver = require('./resolver');
const client = require('./dataSource/client');
const dataSources = require('./dataSource');
const cache = require('./dataSource/cache');
const router = require('./router');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const checkTokenExpiration = require('./middlewares/checkTokenExpiration')
const morgan = require('morgan');
const jwt = require('jsonwebtoken');



cache.flushAll();

const corsOptions = {
    origin: '*',
    credentials: true
}
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader("Access-Control-Allow-Headers", "Referer, Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization, Cookie");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use(express.static('public'))

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));


app.use(morgan('dev'));

app.use(fileUpload({
    createParentPath: true
}));






app.use(router);

app.use(checkTokenExpiration);





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
        // Cette méthode contexte renvoi un objet qui sera passé au DataSource
        // via leur méthode initialze (pour faire l'injection de dépendances)
        const authHeader = req.headers.authorization;
        let user = null;
        if (authHeader) {
            
            const token = authHeader.split(' ')[1];

            let result = null;
            try{
                result = jwt.verify(token, process.env.TEMPORARYTOKENSECRET,{ignoreExpiration: false});
                console.log('user identified')
                user = result;
                return {
                    sqlClient: client,
                    user: user
                };

            } catch (error){

                return {
                    sqlClient: client,
                    error: error.name, 
                    code: 9
                };
                    

                
            } 
        } else {
            return {
                sqlClient: client,
                error: "Not authorized, this query requires user login", 
                code: 9
            };
        }



    },

    // On donne nos dataSources à ApolloServer
    // Il va les "initialize" pour qu'elles récupère leurs dépendances
    // et il va les mettre à disposition des nos resolvers
    // /!\ dataSources à la même structure que context au dessus c'est une fonction
    // qui renvoi un objet !!!!
    dataSources: () => {
        return dataSources;
    }
    // équivalent
    // dataSources: () => dataSources

});


// Et ensuite on passe le middleware associé à express
// chargé sur la route /graphql
// app.use(graphQLServer.getMiddleware());

graphQLServer.applyMiddleware({ app, cors: corsOptions });


app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on :', process.env.PORT);
});