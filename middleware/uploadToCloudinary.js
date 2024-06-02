const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({});

const upload = multer({ storage: storage });

const uploadToCloudinary = (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
        console.log(req.file);
        if (err) {
            return res.status(500).json({ message: 'Image upload failed.' });
        }

        if (!req.file) {
            return next();
            // return res.status(400).json({ message: 'No image file provided.' });
        }

        try {
            const result = await cloudinary.uploader.upload(req.file.path);

            req.imageUrl = result.secure_url;
            console.log(result.secure_url);
            next();
        } catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ message: 'Image upload failed.' });
        }
    });
};

module.exports = uploadToCloudinary;
