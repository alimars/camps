var express=require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");

// GET ROUTE
router.get("/campgrounds", function(req,res){
    Campground.find({}, function(err, campgrounds){
        if(err){
        console.log(err);
        } else {
             res.render("campgrounds/index",{campgrounds: campgrounds});
        }
    });

});
// NEW ROUTE
router.get("/campgrounds/new",isLoggedIn, function(req,res){
    res.render("campgrounds/new.ejs");
});

// CREATE ROUTE
router.post("/campgrounds",isLoggedIn, function(req,res){
   var name=req.body.name;
   var image=req.body.image;
   var desc=req.body.description;
   var price=req.body.price;
   var author=
   {
       id: req.user._id,
       username: req.user.username
   }
   var newcampground={name:name, image:image, description: desc, author:author, price:price};
Campground.create(newcampground, function(err,camgrounds){
   if(err) {
       console.log(err);
   } else {
    res.redirect("/campgrounds");    
   }
});
});

//EDIT ROUTE
router.get("/campgrounds/:id/edit",checkAuthrization, function(req,res){
         Campground.findById(req.params.id, function(err, foundcampground){
               res.render("campgrounds/edit", {campground: foundcampground});       
    });
  
});

// UPDATE ROUTE
router.put("/campgrounds/:id",checkAuthrization, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err,createdcampground){
        if(err){
          res.redirect("/campgrounds");
        }  else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    }) ;  
});

// SHOW ROUTE
router.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id).populate("comments").exec(function(err,campgroundInst){
      if(err){
          console.log(err);
      } else {
          res.render("campgrounds/show", {campground: campgroundInst});
      }
  });
});
// DESTROY ROUTE
router.delete("/campgrounds/:id",checkAuthrization, function(req,res){
   Campground.findByIdAndRemove(req.params.id, function(err,deleted){
       if(err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});


function isLoggedIn(req,res,next){
   if( req.isAuthenticated()){
       return next();
   }
   res.redirect("/login");
}
function checkAuthrization(req,res,next) {
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
    
}

module.exports=router;