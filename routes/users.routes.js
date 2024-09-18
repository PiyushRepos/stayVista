const express = require("express");
const Router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  handleShowSignupPage,
  handleSignup,
  handleShowLoginPage,
  handleUserLogin,
  handleUserLogout,
} = require("../controllers/users.controller.js");

Router.route("/signup").get(handleShowSignupPage).post(wrapAsync(handleSignup));

Router.route("/login")
  .get(handleShowLoginPage)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(handleUserLogin),
  );

Router.get("/logout", handleUserLogout);

module.exports = Router;
