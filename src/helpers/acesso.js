module.exports = {

    nivelGestor: (req, res, next) => {

        if (req.isAuthenticated() && req.user.acesso == 1) {
            return next();

        } else {
            if (req.isAuthenticated() && req.user.acesso == 0) {
                req.flash("error_msg", "Você precisa ter um acesso de Gestor")
                res.redirect('/homeColaborador');
            }
            else if (req.isAuthenticated() && req.user.acesso == 2) {
                req.flash("error_msg", "Você precisa ter um acesso de Gestor")
                res.redirect('/homeInstrutor');
            } else {
                res.redirect('/login');
            }

        }
    },

    nivelInstrutor: (req, res, next) => {

        if (req.isAuthenticated() && req.user.acesso == 2) {
            return next();

        } else {
            if (req.isAuthenticated() && req.user.acesso == 0) {
                req.flash("error_msg", "Você precisa ter um acesso de Instrutor")
                res.redirect('/homeColaborador');
            }
            else if (req.isAuthenticated() && req.user.acesso == 1) {
                req.flash("error_msg", "Você precisa ter um acesso de Instrutor")
                res.redirect('/homeGestor');
            } else {
                res.redirect('/login');
            }

        }
    },

    nivelColaborador: (req, res, next) => {

        if (req.isAuthenticated() && req.user.acesso == 0) {
            return next();
        } else {
            if (req.isAuthenticated() && req.user.acesso == 1) {
                res.redirect('/homeGestor');
            }
            else if (req.isAuthenticated() && req.user.acesso == 2) {
                res.redirect('/homeInstrutor');
            } else {
                res.redirect('/login');
            }
        }
    },

    logado: (req, res, next) => {

        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash("error_msg", "Você precisa estar logado no sistema!")
            res.redirect('/login');
        }

    },


    estaLogado: (req, res, next) => {

        if (req.isAuthenticated() && req.path == '/login') {
            res.redirect(req.originalUrl)
        }

        if (req.isAuthenticated() && req.path == '/') {
            res.redirect('/');
        }

        if (!req.isAuthenticated() && req.path == '/') {

            res.redirect('/login');
        }

        next();

    },

    nivelRedirect: (req, res, next) => {

        if (req.isAuthenticated() && req.user.acesso == 1) {
            res.redirect('/homeGestor');

        } else if (req.isAuthenticated() && req.user.acesso == 0) {
            res.redirect('/homeColaborador');
        } else if (req.isAuthenticated() && req.user.acesso == 2) {
            res.redirect('/homeInstrutor');
        } else {
            req.flash("error_msg", "Você precisa estar logado no sistema");
            res.redirect("/login");
        }

    }


}