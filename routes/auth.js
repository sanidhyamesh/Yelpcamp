var express = require('express');
var router = express.Router();
var passport = require('passport');
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/user');
var middleware = require('../middleware/middleware');


//ROOT Route
router.get('/', function(req, res){
    res.render('landing');
});

//DISPLAYS Registration form
router.get('/register', function(req, res){
    res.render('register');
}); 

//REGISTERS Users to db
router.post('/register', function(req, res){
    var newUser = new User({username : req.body.username});
    var password = req.body.password;
    User.register(newUser , password , function(Error, user){
        if(Error){
            req.flash('error',Error.message);
            return res.render('register');
        }
        passport.authenticate('local')(req,res, function(){
            req.flash('success','Welcome to yelpcamp');
            res.redirect('/campgrounds');
        });
    });
});

//Displays LOGIN form
router.get('/login', function(req,res){
    res.render('login');
});

//LOGINS User
router.post('/login', passport.authenticate('local',{
    successRedirect : '/campgrounds',
    failureRedirect : '/login'
}) , function(req, res){
});

//LOGOUT Route
router.get('/logout', function(req, res){
    req.logOut();
    req.flash('success','You are logged out');
    res.redirect('/campgrounds');
});


module.exports = router;