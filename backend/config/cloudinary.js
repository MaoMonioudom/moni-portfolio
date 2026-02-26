const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'moni_portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const upload = multer({ storage: storage });

// Helper to delete image from Cloudinary
const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    // Extract public_id from Cloudinary URL:
    // Example: https://res.cloudinary.com/cloud_name/image/upload/v123456789/moni_portfolio/myimage.jpg
    const parts = imageUrl.split('/');
    const folder = 'moni_portfolio';
    const filenameWithExt = parts.pop();
    const publicId = `${folder}/${filenameWithExt.split('.')[0]}`;

    // Use Cloudinary's destroy method
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

module.exports = { cloudinary, upload, deleteImage };
