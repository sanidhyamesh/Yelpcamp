var express = require('express');
var router = express.Router({mergeParams : true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var User = require('../models/user');
var middleware = require('../middleware/middleware');


//DISPLAYS comment form
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(Error, campground){
        if(Error){
            req.flash('error', 'Something went wrong');
            res.redirect('/campgrounds/'+req.params.id);
        }else{
            res.render('comments/new', {campground : campground});
        }
    });
}); 

//SAVES comments to db
router.post('/campgrounds/:id/comments', middleware.isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(Error, campground){
        if(Error){
            req.flash('error', 'Something went wrong');
            res.redirect('/campgrounds/' +req.params.id);
        }else{
            Comment.create(req.body.comment, function(Error, comment){
                if(Error){
                    req.flash('error','Something went wrong');
                    req.redirect('back');
                }else{
                    //Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(); //save comment
                    
                    //Saving comments to campground in db
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash('success','Successfully added comment');
                    res.redirect('/campgrounds/'+ campground._id);
                }
            });
        }
    });
});

//EDIT Comment
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentsOwnership, function(req, res){
    Campground.findById(req.params.id , function(Error, foundCampground){
        if(Error || !foundCampground){
            req.flash('error', 'No campground found');
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, function(Error, foundComment){
            if(Error){
                req.flash('error','Comment not found');
                res.redirect('back');
            }else{
                res.render('comments/edit', {campground_id : req.params.id , comment : foundComment});
            }
        });
    }); 
});

//UPDATE comment
router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentsOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(Error, updatedComment){
        if(Error){
            req.flash('error','Something went wrong');
            res.redirect('back');
        }else{
            console.log(updatedComment);
            req.flash('success','Updated your comment');
            res.redirect('/campgrounds/'+ req.params.id);
        }
    });  
});

//DELETE Comment
router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentsOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(Error){
        if(Error){
            req.flash('error','Something went wrong');
            res.redirect('back');
        }
        else{
            req.flash('success','Comment deleted');
            res.redirect('/campgrounds/'+ req.params.id);
        }
    });
});

module.exports = router;