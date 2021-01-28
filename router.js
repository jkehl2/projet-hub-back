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
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            if(req.session.user === undefined) 
                throw 'authentification required for avatar upload'
            let avatar = req.files.avatar;

            console.log(`uploading file "${avatar.name}"`);
            const fileExtention = avatar.name.substr(avatar.name.indexOf("."));
            const update = await client.query(`
                UPDATE users
                SET 
                    avatar = '/avatars/'||uuid_generate_v1()||$1
                WHERE id = $2
                RETURNING avatar`,[fileExtention , req.session.user.id]
            );
            console.log(update.rows[0])
            const filePath = update.rows[0].avatar;


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


// router.post('/upload-photos', async (req, res) => {
//     try {
//         if(!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             let data = [];

            
//             //loop all files
//             _.forEach(_.keysIn(req.files.photos), (key) => {
//                 let photo = req.files.photos[key];

//                 //move photo to uploads directory
//                 photo.mv('./uploads/' + photo.name);

//                 //push file details
//                 data.push({
//                     name: photo.name,
//                     mimetype: photo.mimetype,
//                     size: photo.size
//                 });
//             });

//             //return response
//             res.send({
//                 status: true,
//                 message: 'Files are uploaded',
//                 data: data
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });



module.exports = router;