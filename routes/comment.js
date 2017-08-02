var express=require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");
var Comment=require("../models/comments");
var middleware=require("../middleware/");

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
   // lookup campground using id
   // create new comments
   // connect new comment to campground
   //redirect to campground show page
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err,comment){
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//edit comment
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentAuthrization, function(req,res) {
    Comment.findById(req.params.comment_id, function(err,foundComment){
       if (err){
           console.log(err);
       } else {
            res.render("comments/edit",{campground_id: req.params.id, comment:foundComment});       
       }
    });
});
//destroy route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentAuthrization, function(req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err,deletedComment){
       if (err){
          res.redirect("back");
       } else {
            res.redirect("/campgrounds/"+req.params.id);       
       }
    });
});

//update route
router.put("/campgrounds/:id/comments/:comment_id/",middleware.checkCommentAuthrization, function(req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,foundComment){
       if (err){
           console.log(err);
       } else {
            res.redirect("/campgrounds/"+ req.params.id);       
       }
    });
});
module.exports=router;