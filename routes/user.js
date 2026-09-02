const express = require("express");
const router = express.Router();
const { saveRedirectURL } = require("../middleware.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/users.js");






// sign up routes


router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup));





// Render Login Form
router.route("/login")
.get(userController.renderLoginform)
.post(saveRedirectURL, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), wrapAsync(userController.login));













// Process Logout
router.route("/logout")
.get(userController.logout);





module.exports = router;