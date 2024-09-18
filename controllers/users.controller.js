const User = require("../model/user.model.js");

const handleShowSignupPage = (req, res) => {
  res.render("users/signup.ejs", { who: "SignUp" });
};

const handleSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome To StayVista! Dear ${req.user.username}`);
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

const handleShowLoginPage = (req, res) => {
  res.render("users/login.ejs", { who: "SignUp" });
};

const handleUserLogin = async (req, res) => {
  req.flash("success", `Welcome Back ${req.user.username} 😊`);
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

const handleUserLogout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};

module.exports = {
  handleShowSignupPage,
  handleSignup,
  handleShowLoginPage,
  handleUserLogin,
  handleUserLogout,
};
