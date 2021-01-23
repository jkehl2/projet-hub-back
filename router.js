const express = require('express');
const authController = require('./controllers/authController');
const isConnected = require('./middlewares/isConnected');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserDataSource = require('./dataSource/userDataSource');
const client = require('./dataSource/client');
const { user } = require('./dataSource');
const bcrypt = require('bcrypt');





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
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.json({"info": `user logged out`})

    });
});



module.exports = router;