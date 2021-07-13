const express = require('express');
const path = require('path');
const app = express();
const port = 9001;
var session = require('express-session');

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
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(function(req,res,next) {
    res.locals = {
        isLoggedIn : req.session.isLoggedIn,
        loggedInUser : req.session.loggedInUser
    };
    return next();
});


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log('req.session.isLoggedIn: '+req.session.isLoggedIn);
    res.render('home', { title: 'Hey', message: 'Hello there!' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'Hey', message: 'Hello there!' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Hey', message: 'Hello there!' });
});

app.post('/login', (req, res) => {
    console.log('req data: ',req.body.email);

    // var host = location.host;
    // let domainParts = host.split('.');
    // domainParts.shift();
    // let domain = '.'+domainParts.join('.');
    // console.log('domain: '+domain);

    req.session.isLoggedIn = true;
    req.session.loggedInUser = {
        email: req.body.email
    };

    res.redirect('/');
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Hey', message: 'Hello there!' });
});

app.listen(port, () => {
    console.log('Server listening at http://localhost:'+port);
});
