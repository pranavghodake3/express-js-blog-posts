const express = require('express');
const router = express.Router();
var BlogUser = require('../models/BlogUser');
const bcrypt = require("bcryptjs");

router.get('/login', (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/');
    }else{
        res.render('login');
    }
});

router.post('/login', (req, res) => {
    BlogUser.findOne({ 'email': req.body.email }).lean()
    .then((blogUser) => {
        bcrypt.compare(req.body.password, blogUser.password, function(error, isMatch) {
            if (error) {
                res.redirect('/auth/login');
            } else {
                req.session.isLoggedIn = true;
                req.session.loggedInUser = blogUser;
                res.redirect('/');
            }
        });
    })
    .catch((err) => {
        res.redirect('/auth/login');
    });

    
    // (function (err, blogUser) {
    //     if (err || !blogUser){
    //         return res.redirect('/auth/login');
    //     }
    //     blogUser.comparePassword(req.body.password, function(matchError, isMatch) {
    //         if (matchError || !isMatch) {
    //             res.redirect('/auth/login');
    //         } else {
    //             req.session.isLoggedIn = true;
    //             req.session.loggedInUser = blogUser;
    //             req.session.loggedInUserEmail = req.body.email;
    //             console.log('After Login req.session.loggedInUserEmail: '+req.session.loggedInUserEmail);
    //             res.redirect('/');
    //         }
    //     });
    // });
});

router.get('/register', (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/');
    }else{
        res.render('register');
    }
});

router.post('/register', (req, res) => {
    var response = {
        success: false,
        message: null,
        data: null
    }
    const newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    }
    if(req.body.password.length >= 6){
        BlogUser.findOne({"email": newUser.email}).lean()
        .then((existingUser) => {
            if(!existingUser){
                var blogUser = new BlogUser(newUser);
                blogUser.save(function(err,result){
                    if (err){
                        response.success = false;
                        response.message = "Something went wrong.";
                        res.status(400).json(response);
                    }else{
                        response.success = true;
                        response.message = "User registered successfully. Please login now.";
                        response.data = result;
                        res.status(200).json(response);
                    }
                });
            }else{
                response.success = false;
                response.message = "Email is already exists.";
                res.status(200).json(response);
            }
        })
        .catch((err) => {
            response.success = false;
            response.message = "Something went wrong.";
            res.status(500).json(response);
        })
    }else{
        response.success = false;
        response.message = "Password should have minimum 6 characters.";
        res.status(200).json(response);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;