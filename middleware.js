const Image = require("./models/image.js");
const ExpressError = require("./utils/ExpressError.js");
const { imageSchema } = require("./schema.js");
const mongoose = require("mongoose");

// Check whether user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be signed in to perform this action");
        return res.redirect("/login");
    }
    next();
};

// Save the URL user wanted to visit
module.exports.saveRedirectURL = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
};

// Check image ownership or admin status
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Image ID");
        return res.redirect("/images");
    }

    const image = await Image.findById(id);

    if (!image) {
        req.flash("error", "Image not found");
        return res.redirect("/images");
    }

    if (res.locals.currUser) {
        const isUserAdmin = res.locals.currUser.role === "admin";
        const isUserOwner = image.owner && image.owner.equals(res.locals.currUser._id);

        if (isUserAdmin || isUserOwner) {
            return next();
        }
    }

    req.flash("error", "You do not have permission to modify this image");
    return res.redirect(`/images/${id}`);
};

// Validate image data
module.exports.validateImage = (req, res, next) => {
    const { error } = imageSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(errMsg, 400);
    }

    next();
};

// Check whether user is admin
module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be signed in to perform this action");
        return res.redirect("/login");
    }

    if (res.locals.currUser?.role !== "admin") {
        req.flash("error", "Only admins are authorized to perform this action");
        return res.redirect("/images");
    }

    next();
};
