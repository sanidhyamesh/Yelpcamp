var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');

var campgroundRoutes = require('./routes/campgrounds');
var commentsRoutes = require('./routes/comments');
var authRoutes = require('./routes/auth');
 
mongoose.connect("mongodb://localhost/yelp_camp", {useUnifiedTopology: true, useNewUrlParser : true, useCreateIndex: true});
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');  
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

//seedDB(); // seed the database

//PASSPORT CONFIG
app.use(require('express-session')({
    secret : "wohhlaaa",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(campgroundRoutes);
app.use(commentsRoutes);
app.use(authRoutes);


app.listen('3000', function(req, res){
    console.log("The YelpCamp Server Has Started");
});