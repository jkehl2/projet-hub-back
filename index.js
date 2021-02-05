require('dotenv').config();
const express = require('express');
const graphQLServer = require('./app/graphQLServer')
const cache = require('./app/custom_modules/cache');
const router = require('./app/router');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const myCors = require('./app/middlewares/myCors')
const tokenCheck = require('./app/middlewares/tokenCheck')
const morgan = require('morgan');


// Clear cache memory at server start
cache.flushAll();

// Console-logging all server's requests
app.use(morgan('dev'));

// Apply custom CORS middleware
app.use(myCors);

// Define public folder
app.use(express.static('public'))

// Allow folder creation during file upload if folders do not exist already
app.use(fileUpload({
    createParentPath: true
}));

// Enble body content handling forms & json
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

// Check authentification token status 
app.use(tokenCheck);

// Routing for all non-graphQL requests
app.use(router);

// Handle GraphQL requests on route "/graphql" and reapply CORS policy disabled by GraphQL
graphQLServer.applyMiddleware({ app, cors: {
    origin: '*',
    credentials: true
} });

// Define server's listening port
app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on :', process.env.PORT);
});