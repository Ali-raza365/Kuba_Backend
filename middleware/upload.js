const multer = require('multer');
const path = require('path');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware to handle multiple image uploads
const uploadMiddleware = (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => { // Allow up to 10 files
    if (err) {
      return res.status(400).send('Error uploading files.');
    }

    if (!req.files || req.files.length === 0) {
      console.log("No files uploaded.");
      next();
      return;
    }

    req.imageUrls = req.files.map(file => `uploads/${file.filename}`);
    next();
  });
};

module.exports = uploadMiddleware;
