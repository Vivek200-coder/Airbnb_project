if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

console.log("Cloud name:", process.env.CLOUD_NAME);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormat: ["png", "jpg", "jpeg"],
  },
});

module.exports = { cloudinary: cloudinary.v2, storage };