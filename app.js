var express = require("express");
var app = express();

var passport = require("passport");
app.use(passport.initialize());

var session = require("express-session");
app.use(session({ secret: "123456" }));
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  await User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

// passport.deserializeUser(function (user, done) {
//   // console.log("ああああああああああああああ");
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var LocalStrategy = require("passport-local").Strategy;

// 認証処理の定義
passport.use(
  new LocalStrategy(function (username, password, done) {
    if (username == "admin" && password == "password") {
      return done(null, username);
    } else {
      return done(null, false);
    }
  })
);

// EJS設定
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// ログインページ
app.get("/", function (req, res) {
  res.render("login", {});
});

// 認証処理
app.post(
  "/auth",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/",
    failureFlash: true,
  })
);

// 認証後ページ
app.get("/secret", function (req, res) {
  if ("passport" in req.session && "user" in req.session.passport) {
    res.render("secret", {});
  } else {
    res.redirect("/");
  }
});

app.listen(3456, function () {});

// app.get("/", (req, res) => {
//   res.send("Hello ルートページ!!!");
// });

// app.get("/page1", (req, res) => {
//   res.send("Hello page1!!!");
// });

// app.get("/page2", (req, res) => {
//   res.send("Hello page2!!!");
// });

// app.get("/page3", (req, res) => {
//   res.send("Hello page3!!!");
// });
