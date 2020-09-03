var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");


// INDEX       /campgrounds       GET     Display a list of all campgrounds
router.get("/", function(req,res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE      /campgrounds       POST    Add new campground to DB
router.post("/", middleware.isLoggenIn, function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    
    //Create new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            //show user what the error is and send him back
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// NEW         /campgrounds/new   GET     Displays form to make a new campground
router.get ("/new", middleware.isLoggenIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - Shows more info about one campground
router.get("/:id", function(req, res) {
    //find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err){
            console.log(err);
        } else {
            if (!foundCampground) {
                return res.status(400).send("Item not found.")
            }
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    //show that campground
});


//EDIT campground route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(!err){
            if (!foundCampground) {
                return res.status(400).send("Item not found.")
            }
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    });
});


//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update correct campground
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect somewhere(show page)

});

//DESTROY Campground route

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});


module.exports = router;