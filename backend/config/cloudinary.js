const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // dpblcbupi
  api_key: process.env.CLOUD_KEY,     // 876219772136659
  api_secret: process.env.CLOUD_SECRET // HuYpgMSE7jgp3TJZHlKqdru616M
});

module.exports = cloudinary;
