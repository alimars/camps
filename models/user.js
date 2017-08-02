var mongoose =require("mongoose");
var passpoerLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
   username: String,
   password: String
   
});
userSchema.plugin(passpoerLocalMongoose);
var User=mongoose.model("User", userSchema);

module.exports=User;