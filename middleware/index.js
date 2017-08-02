var Campground=require("../models/campgrounds");
var Comment=require("../models/comments");
var middlwareObj={};

middlwareObj.checkAuthrization= function(req,res,next) {
   if (req.isAuthenticated()) {
             Campground.findById(req.params.id, function(err, foundcampground){
           if (err){
               res.redirect("back");
           } else {
               if(foundcampground.author.id.equals(req.user._id)) {
                   next();       
               } else {
                   res.redirect("back");
               }
           }
        });
    } else {
        res.redirect("back");
    }
    
};

middlwareObj.checkCommentAuthrization= function(req,res,next) {
   if (req.isAuthenticated()) {
             Comment.findById(req.params.comment_id, function(err, foundcomment){
           if (err){
               res.redirect("back");
           } else {
               if(foundcomment.author.id.equals(req.user._id)) {
                   next();       
               } else {
                   res.redirect("back");
               }
           }
        });
    } else {
        res.redirect("back");
    }
};
middlwareObj.isLoggedIn=function(req,res,next){
   if( req.isAuthenticated()){
       return next();
   }
   req.flash("error","You need to log in before you go ahead");
   res.redirect("/login");
};

module.exports=middlwareObj;