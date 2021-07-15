const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const port = 9001;
var session = require('express-session');
const mongoose = require('mongoose');
var BlogUser = require('./models/BlogUser');

// Middlewares
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended : true})); // to support URL-encoded bodies
app.use(function(req,res,next) {
    res.locals = {
        isLoggedIn : req.session.isLoggedIn,
        loggedInUser : req.session.loggedInUser
    };
    return next();
});

// DB Connection
mongoose.connect(process.env.DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.set('view engine', 'pug');

app.use(function (req, res, next) {
    res.locals = {
        isLoggedIn: req.session.isLoggedIn
    };
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/login', (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/');
    }else{
        res.render('login');
    }
});

app.post('/login', (req, res) => {
    BlogUser.findOne({ 'email': req.body.email }).exec(function (err, blogUser) {
        if (err || !blogUser){
            return res.redirect('/login');
        }
        blogUser.comparePassword(req.body.password, function(matchError, isMatch) {
            if (matchError || !isMatch) {
                res.redirect('/login');
            } else {
                req.session.isLoggedIn = true;
                req.session.loggedInUser = {
                    email: req.body.email
                };
                res.redirect('/');
            }
        });
    });
});

app.get('/register', (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/');
    }else{
        res.render('register');
    }
});

app.post('/register', (req, res) => {
    const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    }
    var blogUser = new BlogUser(newUser);
    blogUser.save(function(err,result){
        if (err){
            console.log(err);
            res.end(err);
        }
        else{
            console.log(result)
            res.redirect('/login');
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(port, () => {
    console.log('Server listening at http://localhost:'+port);
});
