const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const handleBars = require('express-handlebars');
const moment = require('moment');
const cursoRotas = require('./src/router/cursoRotas');
const gestorRotas = require('./src/router/gestorRotas');
const instrutorRotas = require('./src/router/instrutorRotas');
const colaboradorRotas = require('./src/router/colaboradorRotas');
const setorRotas = require('./src/router/setorRotas');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./src/config/auth')(passport);

//sessão
app.use(session({
    secret: "minhachave",
    resave: true,
    saveUninitialized: true
}))

//console.log(global.colaboradorId)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    res.locals.gestor = false;
    res.locals.colaborador = false;
    res.locals.instrutor = false;
    if (req.user != null && req.user.acesso == 1) {
        res.locals.gestor = true;
    } else if (req.user != null && req.user.acesso == 0) {
        res.locals.colaborador = true;
    } else if (req.user != null && req.user.acesso == 2) {
        res.locals.instrutor = true;
    }
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Estilo css   
//app.use(express.static('public'))


app.engine('handlebars', handleBars({
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => {
            if (date == "" || date == null) {
                return "Nenhuma avaliação!"
            } else {
                let data = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
                return moment(data).format('DD/MM/YYYY')
            }

        },

        formatDateAnoMes: (date) => {
            if (date == "" || date == null) {
                return "Nenhuma avaliação!"
            } else {
                let data = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
                return moment(data).format('MM/YY');
            }

        },

        formatDateDiaMes: (date) => {
            if (date == "" || date == null) {
                return "Nenhuma avaliação!"
            } else {
                let data = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
                return moment(data).format('DD/MM');
            }

        },


        formatoDataFrequencia: (date) => {

            return moment(date).format('DD/MM/YYYY');
        },

        formatDateHora: (date) => {

            let data = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
            return moment(data).format('YYYY-MM-DDTHH:mm')
        },
        selecionar: (option, value) => {
            if (option == value) {
                return ' selected';
            } else {
                return ''
            }
        },

        formatDateHorario: (date) => {

            let data = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);

            return moment(data).format('DD/MM/YYYY HH:mm')
        },

        ifCond: (v1, operator, v2, options) => {

            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },

        section: (name, options) => {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));
app.set('view engine', 'handlebars');
app.use(express.static('img'));
app.use(express.static(path.join(__dirname, "public")));

app.use(cursoRotas);
app.use(colaboradorRotas);
app.use(setorRotas);
app.use(gestorRotas);
app.use(instrutorRotas);


app.listen(3000);