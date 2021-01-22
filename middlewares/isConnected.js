

const isConnected = (req, res, next) => {

    // si l'utilisateur est connecté ...
    if (req.session.user) {
        // ... passe à la suite ! 
        next();

    } else {
        // si pas connecté => retour à la page login
        // res.redirect('/login');
        console.log('not logged')
    }

};

module.exports = isConnected;