var express=require("express");
var app=express();
var bodyParser= require('body-parser');
var mongoose =require("mongoose");
var methodeOverride=require("method-override");
var flash= require("connect-flash");
var campgroundsRouter =require("./routes/campgrounds");
var passport=require("passport");
var LocalStrategy= require("passport-local");
var seedDB=require("./seed");
var commentRouter=require("./routes/comment");
var User=require("./models/user");
var indexRouter=require("./routes/index");

app.use(bodyParser.urlencoded({extended: true }));
app.set("view engine", "ejs");
app.use( express.static(__dirname+"/public"));
app.use(methodeOverride("_method"));
app.use(flash());
mongoose.connect("mongodb://localhost/yelp_db");

//seedDB(); seeds the database
//passport configuration 
app.use(require("express-session")({
    secret: 'this is secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
app.use(indexRouter);
app.use(campgroundsRouter);
app.use(commentRouter);



app.listen(process.env.PORT, process.env.IP, function(){
   console.log('server running'); 
});