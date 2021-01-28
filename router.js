const express = require('express');
const router = express.Router();
const client = require('./dataSource/client');
const _ = require('lodash');



/** Gestion des utilisateurs */

router.get('/',async (req, res) => {
    res.sendFile('index.html');
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
            
        req.session.user = user;
        res.json(user);
    } catch(error) {
        res.json({"error": error})
    }
});

router.post("/logout", (req, res) => {
    console.log(req.session.user);
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.json({"info": `user logged out`})

    });
});


router.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.json({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            if(req.session.user === undefined) 
                throw 'authentification required for avatar upload'
            let avatar = req.files.avatar;

            console.log(`uploading file "${avatar.name}"`);
         


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
        }
    } catch (err) {
        res.status(500).json(err);
    }
});






module.exports = router;