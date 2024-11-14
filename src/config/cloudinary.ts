require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình Cloudinary bằng thông tin từ môi trường (.env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình CloudinaryStorage để lưu trữ ảnh vào Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req:any, file:any) => {
    let folder = 'uploads'; // Mặc định là thư mục "uploads"
    
    // Xử lý các loại file khác nhau để lưu vào các thư mục riêng biệt
    if (file.fieldname === 'cover') {
      folder = 'covers';  // Nếu là trường "cover", lưu vào thư mục "covers"
    } else if (file.fieldname === 'images') {
      folder = 'images';  // Nếu là trường "images", lưu vào thư mục "images"
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png'], // Định dạng ảnh cho phép
    };
  },
});

// Tạo middleware multer để xử lý nhiều file
const upload = multer({ storage: storage }).fields([
  { name: 'cover', maxCount: 5 },   // Tối đa 5 file cho trường "cover"
  { name: 'images', maxCount: 10 }, // Tối đa 10 file cho trường "images"
]);


module.exports = { upload, cloudinary };
