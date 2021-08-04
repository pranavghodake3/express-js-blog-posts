const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
var session = require('express-session');
const mongoose = require('mongoose');
const Post = require('./models/Post');
const helper = require('./helper');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(function (req, res, next) {
    res.locals = {
        isLoggedIn: req.session.isLoggedIn,
        loggedInUser: req.session.loggedInUser
    };
    next();
});

app.set('view engine', 'pug');



app.get('/', (req, res) => {
    Post.find().sort('-date').lean().populate('user')
    .then((posts) => {
        var newposts = posts.map((post) => {
            return {
                ...post,
                "date": helper.timeSince(post.date)
            }
        });
        res.render('home', {"posts": newposts});
    })
    .catch((err) => {
        console.log('err: ', err);
        res.render('home', {"posts": []});
    });
});

app.get('/posts/:id', (req, res) => {
    Post.findOne({"_id": req.params.id}).lean().populate('user')
    .then((post) => {
        console.log('Single post: ',post);
        post.date = helper.timeSince(post.date);
        res.render('view_post', {"post": post});
    })
    .catch((err) => {
        res.render('view_post');
    })
})

app.use('/auth', require('./routes/auth'));

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/create-post', (req, res) => {
    res.render('create-post');
});

app.post('/create-post', (req, res) => {
    const postData = new Post({
        title: req.body.title,
        content: req.body.content,
        user: req.session.loggedInUser._id
    });
    postData.save()
    .then(data => {
        res.redirect('/');
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
});

app.get('/profile', (req, res) => {
    res.render('profile', res.locals);
});

app.listen(process.env.DEFAULT_PORT, () => {
    console.log('Server listening at http://localhost:'+process.env.DEFAULT_PORT);
});
