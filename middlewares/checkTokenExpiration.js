const jwt = require('jsonwebtoken');

function checkExpiration(req, res, next) {

    
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) 
            throw {name:"token not present"}

        const token = authHeader.split(' ')[1];

        if (token === undefined)
                throw {name:"token not present"}
            
        jwt.verify(token, process.env.TEMPORARYTOKENSECRET,{ignoreExpiration: false});
        console.log('\x1b[32m%s\x1b[0m', "token validated")
             
        next();

    } catch (error){
            switch(error.name){
                case "TokenExpiredError": {
                    console.log('\x1b[31m%s\x1b[0m', "token expired, cannot proceed with this token")
                    res.json({error:{msg:"session expired", code:1}})
                    return
                }
                case "token not present": {
                    console.log('\x1b[33m%s\x1b[0m', "token not present, proceeding to next middleware anyway")
                    break;
                } 
                default: {
                    console.log('\x1b[33m%s\x1b[0m', "invalid token, proceeding to next middleware anyway")
            
                }
            }
        next();
    }

}

module.exports = checkExpiration;