const jwt = require('jsonwebtoken');
const unless = require('express-unless');
/**
 * Check token presence & validity: 
 * - if token missing || invalid: store a res.locals.error message and proceed to next middleware
 * - if token expired: send an error response to the client
 * - if token valid: store a res.locals.user object and proceed to next middleware
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
function tokenCheck(req, res, next) {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) 
            throw {name:"token not present"}

        const token = authHeader.split(' ')[1];

        if (token === undefined)
                throw {name:"token not present"}
            
        res.locals.user = jwt.verify(token, process.env.TEMPORARY_TOKEN_SECRET,{ignoreExpiration: false});
        console.log('\x1b[32m%s\x1b[0m', "Token validated, user logged in")

             
        next();

    } catch (error){
            switch(error.name){
                case "TokenExpiredError": {
                    console.log('\x1b[31m%s\x1b[0m', "Token expired, cannot proceed with this token")
                    res.json({error:{msg:"session expired", code:1}})
                    return
                }
                case "token not present": {
                    console.log('\x1b[33m%s\x1b[0m', "Token is missing, proceeding to next middleware anyway")
                    res.locals.tokenError =  "Not authentificated, this query requires user login"
                    break;
                }
                default: {
                    console.log('\x1b[33m%s\x1b[0m', "Token is invalid, proceeding to next middleware anyway")
                    res.locals.tokenError =  "Authentification invalid, this query requires user login"
                }
            }
        next();
    }

}

tokenCheck.unless = unless;

module.exports = tokenCheck;