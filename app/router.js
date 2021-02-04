const express = require('express');
const router = express.Router();
const client = require('./dataSource/client');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const storeFile = require('./custom_modules/storeFile');
const seeder = require('./custom_modules/seeder')

let refreshTokens = [];
const temporaryTokenDuration = parseInt(process.env.TEMPORARY_TOKEN_DURATION,10) || 1000;


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
        console.log('\x1b[32m%s\x1b[0m',"User found, logging...");
        const user = result.rows[0];
        const token = jwt.sign({id: user.id}, process.env.TEMPORARY_TOKEN_SECRET, {expiresIn: temporaryTokenDuration});
/////////////////////////////////////// Using optionnal refresh tokens
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);
 /////////////////////////////////////// 
        res.json({
            token,
            refreshToken, // <-- Using optionnal refresh tokens
            user
        });
    } catch(error) {
        res.json({"error": error})
    }
});


router.post('/token', (req, res) => {
    const { refreshToken } = req.body;
    console.log("Refreshing token")
    if (!refreshToken) {
        return res.json({error:'no refresh token'});
    }
    console.log(refreshTokens)
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({error:'refresh token not valid anymore, please re-login'});
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.json({error:'refresh token invalid'});
        }

        const token = jwt.sign({ id: user.id }, process.env.TEMPORARY_TOKEN_SECRET, { expiresIn: temporaryTokenDuration });
        res.status(201).json({
            token
        });
    });
});

router.post('/logout', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.json({error:'no refresh token'});
    }
    console.log(refreshTokens);
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    console.log(refreshTokens);
    res.json("Logout successful");
});

router.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) 
            throw {error:{msg:"file is missing", code:5}}

        if(!res.locals.user)
            throw {error:{msg:"authentification problem", code:9}}

        const user = res.locals.user

        let avatar = req.files.avatar;

        console.log(`uploading file "${avatar.name}"`);
         
        const filePath = await storeFile.dbUpdateAvatar(avatar.name, user.id)

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
            throw {error:{msg:"file is missing", code:5}}

        if(!res.locals.user)
            throw {error:{msg:"authentification problem", code:9}}
        
        const user = res.locals.user
        
        let image = req.files.image;

        if(!req.body.project_id)
            throw {error:{msg:"project_id is missing", code:6}}

        const projectId = req.body.project_id;

        console.log(`uploading file "${image.name}"`);
         
        const filePath = await storeFile.dbUpdate('image', image.name, user.id, projectId)

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
            throw {error:{msg:"file is missing", code:5}}

        if(!res.locals.user)
            throw {error:{msg:"authentification problem", code:9}}


        const user = res.locals.user
        
        let file = req.files.file;


        if(!req.body.project_id)
            throw {error:{msg:"project_id is missing", code:6}}

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