//all the middleware goes here
var middlwareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlwareObj.checkCampgroundOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    req.flash("error", "Campgrounds not found");
                    res.redirect("back");
                } else {
                    // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                    if (!foundCampground) {
                            req.flash("error", "Item not found.");
                            return res.redirect("back");
                        }
                    // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
                    //does user own campground?
                    if(foundCampground.author.id.equals(req.user._id)) {
                       next();
                    } else {
                        req.flash("error", "You dont have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be loggen in to do that!");
            res.redirect("back");
    }
};

middlwareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                } else {
                    // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
                    if (!foundComment) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                    // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
                    //does user own comment?
                    if(foundComment.author.id.equals(req.user._id)) {
                       next();
                    } else {
                        req.flash("error", "You dont have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be loggen in to do that!");
            res.redirect("back");
    }
};

middlwareObj.isLoggenIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
};


module.exports = middlwareObj;