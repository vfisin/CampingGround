var express       = require("express"),
    app           = express(),
    bodyParser    = require ('body-parser'),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

//Require Routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true}); 
mongoose.connect('mongodb+srv://yelpDB:okn8$5716d@cluster0-jqfib.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("ERROR", err.message);
});

mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
mongoose.set('useFindAndModify', false);
// seedDB();
//yelpDB
//okn8$5716d

// RESTFULL ROUTES
// REST - a mapping between HTTP routes and CRUD(Create, Read, Update, Destroy)
// name         url                verb    Purpouse
// =======================================================
// Index        /campgrounds                    GET     Display a list of all campgrounds
// New          /campgrounds/new                GET     Displays form to make a new campground
// Create       /campgrounds                    POST    Add new campground to DB
// Show         /campgrounds/:id                GET     Show infor about onecampground
// New Comment  /campgrounds/:id/comments/new   GET     Add new comment
// CREATE       /campgrounds/:id/comments/      POST    Commen create route

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins quttest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() { 
    console.log(`YelpCamp Server ${ PORT }`);
});