const mongoose = require("mongoose");
const Image = require("../models/image.js");
const ExpressError = require("../utils/ExpressError.js");
const { cloudinary } = require("../cloudConfig.js");

// ==================== Index (All Images) ====================
module.exports.index = async (req, res) => {
  const images = await Image.find({}).sort({ _id: -1 }).populate("owner", "username").lean();
  res.render("listings/index.ejs", { images, selectedCategory: "all" });
};

// ==================== Render Category Images ====================
module.exports.renderCategoryImages = async (req, res) => {
  const { category } = req.params;
  let images = [];
  if (category && category.toLowerCase() !== "all") {
    const safeCategory = category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    images = await Image.find({
      category: { $regex: new RegExp(`^${safeCategory}$`, "i") }
    })
      .sort({ _id: -1 })
      .populate("owner", "username")
      .lean();
  } else {
    images = await Image.find({}).sort({ _id: -1 }).populate("owner", "username").lean();
  }
  res.render("listings/index.ejs", { images, selectedCategory: category });
};

// ==================== Render New Form ====================
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// ==================== Upload Image ====================
module.exports.uploadImage = async (req, res) => {
  let imgUrl = req.file ? req.file.path : req.body.url;
  let filename = req.file ? req.file.filename : "image";

  if (!imgUrl) {
    req.flash("error", "Please provide an image file or URL.");
    return res.redirect("/images/new");
  }

  const { title, tags, category } = req.body;
  const parsedTags = typeof tags === "string"
    ? tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
    : (Array.isArray(tags) ? tags : []);

  const newImage = new Image({
    title,
    image: { url: imgUrl, filename },
    category: category || "other",
    tags: parsedTags,
    owner: req.user._id
  });

  await newImage.save();
  req.flash("success", "Image uploaded successfully!");
  res.redirect("/images");
};

// ==================== Show Image ====================
module.exports.showImage = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Image ID");
    return res.redirect("/images");
  }

  const image = await Image.findById(id).populate("owner", "username").lean();
  if (!image) {
    req.flash("error", "Image not found");
    return res.redirect("/images");
  }

  // Build conditions for related images search
  let orConditions = [];
  if (image.category) {
    orConditions.push({ category: image.category });
  }
  if (image.tags && image.tags.length > 0) {
    orConditions.push({ tags: { $in: image.tags } });
  }
  if (image.title) {
    const firstWord = image.title.trim().split(" ")[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (firstWord) {
      orConditions.push({ title: { $regex: new RegExp(firstWord, "i") } });
    }
  }

  let relatedImages = [];
  if (orConditions.length > 0) {
    relatedImages = await Image.find({
      _id: { $ne: id },
      $or: orConditions
    })
      .limit(8)
      .populate("owner", "username")
      .lean();
  }

  res.render("listings/show.ejs", { image, relatedImages });
};

// ==================== Render Edit Form ====================
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Image ID");
    return res.redirect("/images");
  }

  const image = await Image.findById(id).lean();
  if (!image) {
    req.flash("error", "Image not found");
    return res.redirect("/images");
  }

  res.render("listings/edit.ejs", { image });
};

// ==================== Update Image ====================
module.exports.updateImage = async (req, res) => {
  const { id } = req.params;
  const { title, url, tags, category } = req.body;
  const parsedTags = typeof tags === "string"
    ? tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
    : (Array.isArray(tags) ? tags : []);

  let imageToUpdate = {
    title,
    category: category || "other",
    tags: parsedTags
  };

  if (req.file) {
    imageToUpdate.image = { url: req.file.path, filename: req.file.filename };
  } else if (url) {
    imageToUpdate.image = { url, filename: "image" };
  }

  await Image.findByIdAndUpdate(id, imageToUpdate);
  req.flash("success", "Image updated successfully!");
  res.redirect(`/images/${id}`);
};

// ==================== Delete Image ====================
module.exports.deleteImage = async (req, res) => {
  const { id } = req.params;
  const image = await Image.findById(id);

  if (image) {
    // Delete image file from Cloudinary if filename exists and isn't a placeholder
    if (image.image && image.image.filename && image.image.filename !== "image") {
      try {
        await cloudinary.uploader.destroy(image.image.filename);
      } catch (err) {
        console.error("Cloudinary deletion error:", err.message);
      }
    }
    await Image.findByIdAndDelete(id);
    req.flash("success", "Image deleted successfully!");
  } else {
    req.flash("error", "Image not found");
  }

  res.redirect("/images");
};