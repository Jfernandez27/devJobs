const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
// const exphbs = require('express-handlebars');
const { engine } = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('./config/passport');

require('dotenv').config({ path: 'variables.env' });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(check());
app.use(expressValidator());

//Habilitar handlebars como view engine
// app.engine(
//     'handlebars',
//     exphbs({
//         defaultLayout: 'main',
//         helpers: require('./helpers/handlebars'),
//     })
// );
app.engine('handlebars', engine({ helpers: require('./helpers/handlebars') }));
app.set('view engine', 'handlebars');
app.set('views', './views');

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(
    session({
        secret: process.env.SECRET,
        key: process.env.KEY,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

//Alerts
app.use(flash());

//Middleware
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

app.use('/', router());

app.listen(process.env.PORT);
