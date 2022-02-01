var express = require("express");
const bcrypt = require("bcrypt");
var app = express();

var passport = require("passport");
app.use(passport.initialize());

var session = require("express-session");
app.use(session({ secret: "123456" }));
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  // User.findById(id, function(err, user) {
  // });
  done(null, user);
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
var LocalStrategy = require("passport-local").Strategy;

// 認証処理の定義
passport.use(
  new LocalStrategy(function (username, password, done) {
    const hashedPassword = bcrypt.hashSync("password", 10);
    console.log('"password"をハッシュ化:', hashedPassword);
    console.log(
      'bcrypt.compare("password", hashedPassword):',
      bcrypt.compareSync("password", hashedPassword)
    );

    // if (username == "admin" && password == "password") {
    if (
      username == "admin" &&
      password == "password" &&
      // "password"とハッシュ化した"password"の同一性を確認できるのか検討=>結果：できた
      bcrypt.compareSync("password", hashedPassword)
    ) {
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

// 認証確認
function isAuthenticated(req, res, next) {
  // console.log("ここreq.isAuthenticated():", req.isAuthenticated());
  // console.log("ここreq:", req);
  if (req.isAuthenticated()) {
    // 認証済
    return next();
  } else {
    // 認証されていない
    res.redirect("/"); // ログイン画面に遷移
  }
}

// 認証後ページ
// app.get("/secret", function (req, res) {
//   if ("passport" in req.session && "user" in req.session.passport) {
//     res.render("secret", {});
//   } else {
//     res.redirect("/");
//   }
// });
app.get("/secret", isAuthenticated, function (req, res) {
  res.render("secret", {});
});

app.get("/page1", isAuthenticated, (req, res) => {
  res.render("page1", {});
  // res.send("Hello page1!!!");
});

app.get("/page2", isAuthenticated, (req, res) => {
  res.render("page2", {});
});

app.get("/page3", isAuthenticated, (req, res) => {
  res.render("page3", {});
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(3456, function () {});
