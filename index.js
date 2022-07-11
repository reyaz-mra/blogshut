var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
// var session = require("express-session");
var session = require('cookie-session');
var morgan = require("morgan");
var User = require("./models/User");
var Blog = require("./models/Blog");
var Review = require("./models/review");
const { render } = require('ejs');
var multer = require('multer');
var JSAlert = require("js-alert");
const htmlToFormattedText = require("html-to-formatted-text");
var app = express();
app.set("view engine","ejs");
// set our application port
//app.set("port", 4000);
// const port = Process.env.PORT || 4000;

app.set("port", process.env.port || 4000);

app.use(express.static(__dirname + '/public'));
// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());
//App.js is made by Md Reyaz Alam
// Author: Md Reyaz Alam


// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect("/index");
  } else {
    next();
  }
};
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect("/index");
    } else {
      next();
    }
  };

// route for Home-Page
app.get("/", sessionChecker, (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

// route for user signup
app
  .route("/register")
  .get(sessionChecker, (req, res) => {
    res.render("register")
  })
  .post((req, res) => {

    var user = new User({
      name:req.body.name,
      username: req.body.username,
      email: req.body.email,
      password:req.body.password,
    });
    user.save((err, docs) => {
      if (err) {
        res.send("<script>alert('!!!! Register Failed.  username & email Must be Unique & all fields are required')</script>")
        // res.redirect("/register");
      } else {
        console.log(docs)
        req.session.user = docs;
        res.redirect("/home");
      }
    });
  });

  app
  .route("/blogs")
  .get(sessionChecker, (req, res) => {
    res.render("register")
  })
  .post((req, res) => {

    var blog = new Blog({
      category:req.body.category,
      title: req.body.title,
      notes: htmlToFormattedText(req.body.notes),
      date:req.body.date,
      img:req.body.img || "https://qphs.fs.quoracdn.net/main-qimg-5871e4e05dd020122e560c53c0a520db",
      username:req.body.username,
      name:req.body.name,
    });
    blog.save((err, docs) => {
      if (err) {
        console.log(err);
        res.redirect("/write");
      } else {
        console.log(docs)
        req.session.user = docs;
        res.redirect("/profile");
      }
    });
  });

  app
  .route("/reviewform")
  .get(sessionChecker, (req, res) => {
    res.render("login")
  })
  .post((req, res) => {

    var revw = new Review({
      name:req.body.name,
      rating: req.body.rating,
      comment: req.body.comment,
      date:req.body.date,
    });
    revw.save((err, docs) => {
      if (err) {
        console.log(err);
        res.redirect("/review");
      } else {
        console.log(docs)
        req.session.user = docs;
        res.redirect("/review");
      }
    });
  });

// route for user Login
app
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.render("login")
  })
  .post(async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

      try {
        const user = await User.findOne({ username: username}).exec();
        if(!user) {
          res.send("<script>alert('Invalid Input')</script>");
            res.redirect("/login");
         } 
        // user.comparePassword(password, (error, match) => {
        //     if(!match) {
        //       // alert("Invalid Input");
        //       // res.redirect("/login");
        //       res.send("<script>alert('Invalid Input')</script>");
        //       JSAlert.alert("This is an alert.");
        //     }

        //});
        if(user.password === password){
          req.session.user = user;
           res.redirect("/home")
        }
        else{
          res.send("<script>alert('Invalid Input')</script>");
        }   
    } catch (error) {
      console.log(error)
    }
  });

// route for user's dashboard
app.get("/home", async (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    const user = req.session.user;
    res.render("home", {username : user.username})
  } else {
    res.redirect("/");
  }
});
app.get("/profile", async (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    const user = req.session.user;
    Blog.find({username:user.username},(err,result)=>{
      res.render("profile", {blogs:result,username : user.username,name : user.name,email : user.email})
    })
  } else {
    res.redirect("/login");
  }
});
app.get("/blog", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      const user = req.session.user;
      Blog.find({},(err,result)=>{
        res.render("blog",{blogs:result,username:user.username});
    });
    } else {
      res.redirect("/login");
    }
  });
  app.get("/write", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      const user = req.session.user;
      res.render("write", {username : user.username,name : user.name})
    } else {
      res.redirect("/login");
    }
  });
  app.get("/about", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      const user = req.session.user;
      res.render("about", {username : user.username})
    } else {
      res.redirect("/login");
    }
  });
  app.get("/review", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      const user = req.session.user;
      Review.find({},(err,result)=>{
        res.render("review", {revw:result,username : user.username,name:user.name})
      })
    } else {
      res.redirect("/login");
    }
  });
  app.get("/contact", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      const user = req.session.user;
      res.render("contact", {username : user.username})
    } else {
      res.redirect("/login");
    }
  });
  app.get("/post/:id",(req,res)=>{
    const user = req.session.user;
    Blog.findById(req.params.id,(err,result)=>{
        res.render("post",{blog:result,usernames:user.username});
    })
});

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// start the express server
app.listen(app.get("port"), () =>
  console.log(`App started on port ${app.get("port")}`)
);
