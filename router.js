const express = require('express');
const router = express.Router();
const client = require('./dataSource/client');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const storeFile = require('./dataSource/storeFile');
const seeder = require('./dataSource/seeder')


/** Gestion des utilisateurs */

router.get('/',async (req, res) => {
    res.sendFile('index.html');
})

router.get('/seeder/user/:nb',async (req, res) => {
    const nb = req.params.nb;
    const accountsCreated = await seeder.user(nb);
    res.json(accountsCreated);
})

router.get('/seeder/project/:place/:nb',async (req, res) => {
    const nb = req.params.nb;
    const place = req.params.place;
    const projectsCreated = await seeder.project(place, nb);
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
        const accessTokenSecret = 'youraccesstokensecret';
        const token = jwt.sign({id: user.id}, accessTokenSecret, {expiresIn: 100000});
        res.json({
            token,
            user
        });
    } catch(error) {
        res.json({"error": error})
    }
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
         
        const filePath = await storeFile.dbUpdate('users', 'avatar', 'avatars', avatar.name, user.id)

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






module.exports = router;