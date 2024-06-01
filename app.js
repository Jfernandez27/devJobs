const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

require('dotenv').config({ path: 'variables.env' });

const app = express();

//Habilitar handlebars como view engine
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

app.use('/', router());

app.listen(process.env.PORT);
