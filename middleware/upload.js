const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up storage for multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware to handle image upload
const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).send('Error uploading file.');
    }

    if (!req.file) {
    //   return res.status(400).send('No file uploaded.');
    console.log("No file uploaded.")
    next();
    return
    }
    req.imageUrl = `uploads/${req.file.filename}`;
    next();
  });
};

module.exports = uploadMiddleware

