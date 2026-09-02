if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const compression = require("compression");

const Image = require("./models/image.js");
const User = require("./models/user.js");
const imageRouter = require("./routes/image.js");
const userRouter = require("./routes/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/SP_PHOTO";

main()
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Compression middleware
app.use(compression());

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Body parser & static assets setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1d" }));

// Express session setup
const sessionOption = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());

// Passport authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global locals middleware for views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.currPath = req.path;
  next();
});

// Root route
app.get("/", (req, res) => {
  res.redirect("/images");
});

// Routes middleware
app.use("/images", imageRouter);
app.use("/", userRouter);

// Search route
app.get(
  "/search",
  wrapAsync(async (req, res) => {
    let query = req.query.q ? req.query.q.trim() : "";

    if (!query) {
      return res.render("listings/search.ejs", { images: [], query: "" });
    }

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(safeQuery, "i");

    // 1. Direct search match by title, category, or tags
    let directMatches = await Image.find({
      $or: [
        { title: { $regex: regex } },
        { category: { $regex: regex } },
        { tags: { $regex: regex } }
      ]
    }).populate("owner", "username").lean();

    // 2. Collect tags and categories from direct matches to expand related search results
    let relatedCategories = new Set();
    let relatedTags = new Set();

    directMatches.forEach((img) => {
      if (img.category) relatedCategories.add(img.category);
      if (img.tags && Array.isArray(img.tags)) {
        img.tags.forEach((t) => relatedTags.add(t));
      }
    });

    let searchConditions = [
      { title: { $regex: regex } },
      { category: { $regex: regex } },
      { tags: { $regex: regex } }
    ];

    if (relatedCategories.size > 0) {
      searchConditions.push({ category: { $in: Array.from(relatedCategories) } });
    }
    if (relatedTags.size > 0) {
      searchConditions.push({ tags: { $in: Array.from(relatedTags) } });
    }

    let filteredImages = await Image.find({
      $or: searchConditions
    }).populate("owner", "username").lean();

    res.render("listings/search.ejs", { images: filteredImages, query });
  })
);

// 404 Route Handler
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err: { statusCode, message } });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});