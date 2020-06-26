var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
 
var data = [
    {
        name : "Cloud's Rest", 
        image : "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description : "Blah Blah Blah"
    },
    {
        name : "Desert Mesa",
        image : "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description : "Blah Blah Blah"
    },
    {
        name : "Canyon Floor",
        image : "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80",
        description : "Blah Blah Blah"
    }
]

function seedDB(){
    //Remove all campgrounds
    Campground.remove({},function(Error){
        if(Error){
            console.log(Error);
        }
        console.log('revomed campgrounds');
        //Add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(Error, campground){
                if(Error){
                    console.log(Error);
                }else{
                    console.log("added a new campground");
                    //Add comments
                    Comment.create({
                        text : "This is a great place",
                        author : "Homer"
                    },function(Error,comment){
                        if(Error){
                            console.log(Error);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment");
                        }
                    });
                }
            });
        });  
    });
}


module.exports = seedDB;