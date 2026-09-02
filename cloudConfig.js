const cloudinary = require('cloudinary').v2;
const multerStorage = require('multer-storage-cloudinary');
const CloudinaryStorage = multerStorage.CloudinaryStorage || multerStorage;


cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET,
  secure:true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'SP_PHOTO',
    format: async (req, file) => ['png','jpg','jpeg','gif'].includes(file.mimetype) ? 'png' : 'jpg',
    // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});
 

module.exports = {
    cloudinary,
  storage,

}