const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
var session = require('express-session');
const mongoose = require('mongoose');

// DB Connection
mongoose.connect(process.env.DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

// Middlewares
app.set('trust proxy', 1)
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 }
}));

//app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
//console.log('__dirname: '+__dirname);
//app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(function(req,res,next) {
    res.locals = {
        isLoggedIn : req.session.isLoggedIn,
        loggedInUser : req.session.loggedInUser
    };
    return next();
});
app.use(function (req, res, next) {
    res.locals = {
        isLoggedIn: req.session.isLoggedIn
    };
    next();
});

app.set('view engine', 'pug');



app.get('/', (req, res) => {
    res.render('home');
});

app.use('/auth', require('./routes/auth'));

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.listen(process.env.DEFAULT_PORT, () => {
    console.log('Server listening at http://localhost:'+process.env.DEFAULT_PORT);
});
