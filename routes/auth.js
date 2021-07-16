const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/');
    }else{
        res.render('login');
    }
});

router.post('/login', (req, res) => {
    BlogUser.findOne({ 'email': req.body.email }).exec(function (err, blogUser) {
        if (err || !blogUser){
            return res.redirect('/login');
        }
        blogUser.comparePassword(req.body.password, function(matchError, isMatch) {
            if (matchError || !isMatch) {
                res.redirect('/login');
            } else {
                req.session.isLoggedIn = true;
                req.session.loggedInUser = blogUser;
                res.redirect('/');
            }
        });
    });
});

router.get('/register', (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/');
    }else{
        res.render('register');
    }
});

router.post('/register', (req, res) => {
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

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;