var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/user');
var middlewares = {};

middlewares.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(Error,foundCampground){
            if(Error || !foundCampground){
                req.flash('error','Campground not found');
                res.redirect('back');
            }else{
                //Does user own campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error',"You don't have permission to do that");
                    res.redirect('back');
                }               
            }
        });
    }else{
        req.flash('error', 'you need to be logged in to do that');
        res.redirect('back');
    }
}

middlewares.checkCommentsOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(Error, foundComment){
            if(Error){
                req.flash('error','Comment not found');
                res.redirect('back');
            }else{
                //Does user own campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error',"You don't have permission to do that");
                    res.redirect('back');
                }               
            }
        });
    }else{
        req.flash('error', 'you need to be logged in to do that');
        res.redirect('back');
    }
}

middlewares.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'you need to login to do that');
    res.redirect('/login');
}

module.exports = middlewares;