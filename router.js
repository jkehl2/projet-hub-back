const express = require('express');
const router = express.Router();
const client = require('./dataSource/client');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const storeFile = require('./dataSource/storeFile');
const seeder = require('./dataSource/seeder')

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
let refreshTokens = [];
/** Gestion des utilisateurs */

router.get('/',async (req, res) => {
    res.sendFile('index.html');
})

router.get('/seeder/user/:nb',async (req, res) => {
    const nb = req.params.nb;
    const accountsCreated = await seeder.user(nb);
    res.json(accountsCreated);
})

router.get('/seeder/project/:userId/:place/:nb',async (req, res) => {
    const nb = req.params.nb;
    const place = req.params.place;
    const userId = req.params.userId
    const projectsCreated = await seeder.project(userId, place, nb);
    res.json(projectsCreated);
})



router.post('/login',async (req, res) => {
    // Read username and password from request body
    const { email, password } = req.body;
    try{
        if (!email)
            throw "email/password was not provided";

        const result = await client.query(`
            SELECT 
                id,
                created_at,
                name,
                email,
                avatar 
            FROM users 
            WHERE
                email = $1
            AND 
                password = crypt($2, password)
                `,
            [email, password]);

        if (result.rowCount < 1)
            throw "wrong password or email";
        console.log("user found");
        const user = result.rows[0];
        const token = jwt.sign({id: user.id}, accessTokenSecret, {expiresIn: 100000});
        res.json({
            token,
            user
        });
    } catch(error) {
        res.json({"error": error})
    }
});


router.post('/login-refresh',async (req, res) => {
    // Read username and password from request body
    const { email, password } = req.body;
    try{
        if (!email)
            throw "email/password was not provided";

        const result = await client.query(`
            SELECT 
                id,
                created_at,
                name,
                email,
                avatar 
            FROM users 
            WHERE
                email = $1
            AND 
                password = crypt($2, password)
                `,
            [email, password]);

        if (result.rowCount < 1)
            throw "wrong password or email";
        console.log("user found");
        const user = result.rows[0];
        const token = jwt.sign({id: user.id}, accessTokenSecret, {expiresIn: 2});
///////////////////////////////////////

        const refreshToken = jwt.sign({ id: user.id }, refreshTokenSecret);
        refreshTokens.push(refreshToken);
        // console.log("refresh tokens list")
        // console.log(refreshTokens)
        res.json({
            token,
            refreshToken,
            user
        });
    } catch(error) {
        res.json({"error": error})
    }
});


router.post('/token', (req, res) => {
    const { refreshToken } = req.body;
    console.log("refreshing token")
    if (!refreshToken) {
        return res.json({error:'no refresh token'});
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.json({error:'refresh token invalid'});
        }

        const token = jwt.sign({ id: user.id }, accessTokenSecret, { expiresIn: '20m' });
        console.log("refreshing token")
        console.log(token)
        res.status(201).json({
            token
        });
    });
});

router.post('/logout', (req, res) => {
    const { refreshToken } = req.body;
    console.log(refreshToken);
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    console.log(refreshTokens);
    res.send("Logout successful");
});

router.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) 
            res.json({
                status: false,
                message: 'No file uploaded'
            });

        const authHeader = req.headers.authorization    
        if (!authHeader) 
            throw "identification error"

        const token = authHeader.split(' ')[1];

        const accessTokenSecret = 'youraccesstokensecret';

        const user = await jwt.verify(token, accessTokenSecret,{ignoreExpiration: false});

        let avatar = req.files.avatar;

        console.log(`uploading file "${avatar.name}"`);
         
        const filePath = await storeFile.dbUpdate('avatar', avatar.name, user.id)

        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        avatar.mv('./public' + filePath);

        //send response
        res.json({
            status: true,
            message: 'File is uploaded',
            data: {
                path: filePath,
                mimetype: avatar.mimetype,
                size: avatar.size
            }
        });
        
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('/upload-image', async (req, res) => {
    try {
        if(!req.files) 
            res.json({
                status: false,
                message: 'No file uploaded'
            });

        const authHeader = req.headers.authorization    
        if (!authHeader) 
            throw "identification error"

        const token = authHeader.split(' ')[1];

        const accessTokenSecret = 'youraccesstokensecret';

        const user = await jwt.verify(token, accessTokenSecret,{ignoreExpiration: false});

        let image = req.files.image;

        console.log(`uploading file "${image.name}"`);
         
        const filePath = await storeFile.dbUpdate('image', image.name, user.id)

        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        image.mv('./public' + filePath);

        //send response
        res.json({
            status: true,
            message: 'File is uploaded',
            data: {
                path: filePath,
                mimetype: image.mimetype,
                size: image.size
            }
        });
        
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/upload-file', async (req, res) => {
    try {
        if(!req.files) 
            res.json({
                status: false,
                message: 'No file uploaded'
            });

        const authHeader = req.headers.authorization    
        if (!authHeader) 
            throw "identification error"

        const token = authHeader.split(' ')[1];

        const accessTokenSecret = 'youraccesstokensecret';

        const user = await jwt.verify(token, accessTokenSecret,{ignoreExpiration: false});

        let file = req.files.file;
        let projectId = req.body.project_id;

        console.log(`uploading file "${file.name}"`);
         
        const filePath = await storeFile.dbUpdate('file', file.name, user.id, projectId)

        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        file.mv('./public' + filePath);

        //send response
        res.json({
            status: true,
            message: 'File is uploaded',
            data: {
                path: filePath,
                mimetype: file.mimetype,
                size: file.size
            }
        });
        
    } catch (err) {
        res.status(500).json(err);
    }
});






module.exports = router;