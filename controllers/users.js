const User = require("../models/user.js");

// ==================== Render Sign Up Form ====================
module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

// ==================== Sign Up ====================
module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome to SP PHOTOS, @${username}!`);
      res.redirect("/images");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// ==================== Render Login Form ====================
module.exports.renderLoginform = (req, res) => {
  res.render("users/login.ejs");
};

// ==================== Login ====================
module.exports.login = async (req, res) => {
  req.flash("success", `Welcome back, @${req.user.username}!`);
  const redirectUrl = res.locals.redirectURL || "/images";
  delete req.session.redirectURL;
  res.redirect(redirectUrl);
};

// ==================== Logout ====================
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out successfully!");
    res.redirect("/images");
  });
};
