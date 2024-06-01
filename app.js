const express = require('express');
// const exphbs = require('express-handlebars');
const { engine } = require('express-handlebars');

const path = require('path');
const router = require('./routes');

const app = express();

//Habilitar handlebars como view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router());

app.listen(5000);
