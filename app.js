const express = require("express");
const flash = require("express-flash");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local");

const app = express();

app.use(flash());
app.use(passport.initialize());
app.use(session({ secret: "123456" }));
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

// 認証処理の定義
passport.use(
  new LocalStrategy((username, password, done) => {
    const hashedPassword = bcrypt.hashSync("password", 10);
    // console.log('"password"をハッシュ化:', hashedPassword);
    // console.log(
    //   'bcrypt.compare("password", hashedPassword):',
    //   bcrypt.compareSync("password", hashedPassword)
    // );

    // if (username == "admin" && password == "password") {
    if (
      username == "admin" &&
      password == "password" &&
      // "password"とハッシュ化した"password"の同一性を確認できるのか検討=>結果：できた
      bcrypt.compareSync("password", hashedPassword)
    ) {
      return done(null, username);
    } else {
      return done(null, false, {
        message: "ユーザーIDまたはパスワードが間違っています。",
      });
    }
  })
);

// シリアライズとデシリアライズを設定
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // User.findById(id, function(err, user) {
  // });
  done(null, user);
});

// EJS設定
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// ログインページ
app.get("/", (req, res) => {
  res.render("login", {});
});

// 認証処理
app.post(
  "/auth",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/",
    failureFlash: true,
    badRequestMessage: "「メールアドレス」と「パスワード」は必須入力です。",
  })
);

// 認証確認
const isAuthenticated = (req, res, next) => {
  // console.log("req.isAuthenticated():", req.isAuthenticated());
  // console.log("req:", req);
  if (req.isAuthenticated()) {
    // 認証済
    return next();
  } else {
    // 認証されていない
    res.redirect("/"); // ログイン画面に遷移
  }
};

// 認証後ページ
app.get("/secret", isAuthenticated, (req, res) => {
  res.render("secret", {});
});

app.get("/page1", isAuthenticated, (req, res) => {
  res.render("page1", {});
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

const server = app.listen(process.env.PORT || 3456, function () {
  console.log(`=> Listening on http://localhost:${server.address().port}`);
});
