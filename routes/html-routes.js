// Requiring path to so we can use relative routes to our HTML files
var db = require("../models");
var axios = require("axios");

// Requiring our custom middleware for checking if a user is logged in
//var isAuthenticated = require("../config/middleware/isAuthenticated");


module.exports = function (app) {

  app.get("/", function (req, res) {
    // If the user already has an account send them to the members page
    db.Review.findAll({ include: db.User, order: [["updatedAt", "ASC"]] }).then(function (myReviews) {
      axios.get("http://www.omdbapi.com/?apikey=" + process.env.OMDB_KEY + "&t=" + "frozen").then(function (omdbData) {
        res.render("index", { msg: "Hi there!", user: req.user, reviews: myReviews, img: omdbData.data.Poster });
      });

    });
  });

  app.get("/index", function (req, res) {
    res.redirect("/");
  });

  app.get("/members", function (req, res) {
    res.render("members", { msg: "WHO DAT", user: req.user });
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/index");
    } else {
      res.sendFile(path.join(__dirname, "../public/login.html"));
    }
  });

  app.get("/signup", function (req, res) {
    // If the user already has an account send them to the members page
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/");
  });
};
