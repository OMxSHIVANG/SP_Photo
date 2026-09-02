if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" });
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Image = require("../models/image.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/SP_PHOTO";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB successfully");
    await initDB();
  } catch (err) {
    console.error("Database initialization error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

const initDB = async () => {
  const existingCount = await Image.countDocuments();
  const forceSeed = process.argv.includes("--force");

  if (existingCount > 0 && !forceSeed) {
    console.log(`Database already contains ${existingCount} images. Skipping auto-wipe.`);
    console.log("To force re-initialization, run: node init/index.js --force");
    return;
  }

  if (forceSeed) {
    console.log("Force flag detected (--force). Wiping existing images...");
    await Image.deleteMany({});
  }

  if (initData.data && initData.data.length > 0) {
    await Image.insertMany(initData.data);
    console.log(`Database successfully seeded with ${initData.data.length} sample images.`);
  } else {
    console.log("No sample data found in init/data.js to insert.");
  }
};

main();
