if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

console.log("Cloud name:", process.env.CLOUD_NAME);

const storage = multerStorageCloudinary({
  cloudinary: cloudinary,
  folder: 'wanderlust_DEV',
  allowedFormats: ["png", "jpg", "jpeg"],
});

module.exports = { cloudinary: cloudinary.v2, storage };