const bcrypt = require('bcrypt');


const authController = {


    login: async (req, res) => {
        try {    
            // 1. on cherche si l'utilisateur existe dans la BDD
            const existingUser = await User.findOne({
                where: {
                    email: req.body.email
                }
            });
            // si c'est pas le cas => erreur
            if (!existingUser) {
                res.render('login');
            } else {
                // 2. on compare le mot de passe à celui (hasché) qui est dans la BDD
                const validPassword = bcrypt.compareSync(req.body.password,existingUser.password );

                // si le mdp n'est pas bon => erreur
                if (!validPassword) {
                    console.log('password incorrect')
                } else {
                    // sinon => connexion !

                    // pour garder l'utilisateur connecté, on va bêtement le mettre dans la session
                    req.session.user = existingUser;

                    // voilà, c'est bon. On peux revenir à la page d'acceuil

                    res.redirect('/');
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
        //console.log(req.body);
    }

};


module.exports = authController;