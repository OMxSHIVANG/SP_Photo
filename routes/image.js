const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {
  isLoggedIn,
  isOwner,
  validateImage
} = require("../middleware.js");

const imageController = require("../controllers/images.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// ================= INDEX + CREATE =================

router.route("/")
  .get(
    wrapAsync(imageController.index)
  )
  .post(
    isLoggedIn,
    upload.single("url"),
    validateImage,
    wrapAsync(imageController.uploadImage)
  );


// ================= CATEGORY =================

router.get(
  "/category/:category",
  wrapAsync(imageController.renderCategoryImages)
);


// ================= NEW FORM =================

router.get(
  "/new",
  isLoggedIn,
  imageController.renderNewForm
);


// ================= EDIT FORM =================

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(imageController.renderEditForm)
);


// ================= SHOW / UPDATE / DELETE =================

router.route("/:id")
  .get(
    wrapAsync(imageController.showImage)
  )
  .put(
    isLoggedIn,
    isOwner,
    upload.single("url"),
    validateImage,
    wrapAsync(imageController.updateImage)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(imageController.deleteImage)
  );


module.exports = router;