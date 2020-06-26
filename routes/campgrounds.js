var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/user');
var middleware = require('../middleware/middleware');

//INDEX- Displays all campgrounds
router.get('/campgrounds', function(req, res){
    Campground.find({},function(Error, allcampgrounds){
        if(Error){
            req.flash('error','something went wrong');
            res.redirect('/');
        }else{
            res.render('campgrounds/index', {campgrounds: allcampgrounds, currentUser : req.user});
        }
    });
});

//CREATE- Adds campgrounds to db 
router.post('/campgrounds', middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //Adding Users info to campground collection
    var author = {
        id : req.user._id,
        username : req.user.username 
    };
    //Passing objects 
    var newCampground = {name : name, image : image, description : desc, author : author};
    
    Campground.create(newCampground, function(Error, newlyCreated){
        if(Error){
            req.flash('error','Something went wrong, Please try again');
            res.redirect('/campgrounds');
        }
        else{
            console.log(newlyCreated);
            res.redirect('/campgrounds');
        }
    });
});

//NEW- Displays form to add a new campground
router.get('/campgrounds/new', middleware.isLoggedIn , function(req, res){
    res.render('campgrounds/new');
});

//SHOW- shows more info about one campground
router.get('/campgrounds/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(Error, foundCampground){
        if(Error || !foundCampground){
            req.flash('error', 'Campground not found');
            res.redirect('back');
        }else{
            res.render('campgrounds/show', {campground : foundCampground });
        }
    });  
});

//EDIT Campground
router.get('/campgrounds/:id/edit', middleware.checkCampgroundOwnership , function(req, res){
        Campground.findById(req.params.id, function(Error,foundCampground){
            if(Error){
                req.flash('error','Something went wrong');
                res.redirect('back');
            }else{
                res.render('campgrounds/edit',{campground : foundCampground});             
            }
        });
});

//UPDATE Campground
router.put('/campgrounds/:id', function(req, res){
    Campground.findByIdAndUpdate(req.params.id , req.body.campground, function(Error, updatedCampground){
        if(Error){
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        }else{
            console.log(updatedCampground);
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

//DESTROY Campground
router.delete('/campgrounds/:id', middleware.checkCampgroundOwnership , function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(Error){
        if(Error){
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        }else{
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;