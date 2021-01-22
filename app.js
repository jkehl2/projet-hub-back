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
const session = require('express-session');
const { user } = require('./dataSource');
const connectRedis = require('connect-redis');
const app = express();
const redis = require('redis');
const cors = require('cors');
var url = require('url');



cache.flushAll();


app.use(cors({
    origin: '*',
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type'
}));


app.use(bodyparser.json());
const RedisStore = connectRedis(session);
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
redisClient.auth(redisURL.auth.split(":")[1]);

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

app.use(session({
    //mot de passe servant à crypter les infos
    secret: 'my super secret passphrase',
    //va sauvegarder une nouvelle session même si elle n'est pas modifiée
    saveUninitialized: true,
    //resauvegarde une session à chaque requête même sans modif (pas de date d'expiration)
    resave: true,
    store: new RedisStore({ client: redisClient }),
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}));


app.use(router);
// On va venir "créer" notre serveur GraphQL (comme on créérais un router ou l'app express)
const graphQLServer = new ApolloServer({
    // On lui donne le schema
    typeDefs: schema,
    // et les resolvers
    resolvers: resolver,

    // J'injecte dans le "context" notre client sql
    context: ({ req,res }) => {
        // Cette méthode contexte renvoi un objet qui sera passé au DataSource
        // via leur méthode initialze (pour faire l'injection de dépendances)
        if (req.session.user) {
            const user = req.session.user;
            console.log(`user ${user.email} making queries`)
            return {
                sqlClient: client,
                user: user
            };
        } else {
            console.log(`unidendified user making queries`)
            return {
                sqlClient: client,
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
app.use(graphQLServer.getMiddleware());

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on :', process.env.PORT);
});