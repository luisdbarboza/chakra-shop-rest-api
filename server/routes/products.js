const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Product = require("../models/products");
const { respondWithErrorMessage, deleteFile } = require("../helpers/helpers");

const currentRoute = express.Router();

const uploadFolder = path.join(__dirname, "../uploads/products");
const acceptedTypes = ["image/jpeg", "image/png"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const filenameArray = file.originalname.split(".");
    const extension = filenameArray[filenameArray.length - 1];

    cb(null, file.filename + Date.now() + uuidv4() + "." + extension);
  },
});

const fileFilter = (req, file, cb) => {
  req.fileValidationErrors = false;

  if (acceptedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationErrors = true;
    cb(null, false);
  }
};

const limits = {
  fileSize: 7000000,
};

const upload = multer({ storage, fileFilter, limits });

currentRoute
  .route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find({});

      res.json({
        ok: true,
        products,
      });
    } catch (err) {
      respondWithErrorMessage(res, err, 500);
    }
  })
  .post(upload.array("images", 5), async (req, res) => {
    const images = req.files.map((imageObj) => imageObj.path);

    try {
      const { name, price, description, seller, category } = req.body;

      const product = new Product({
        name,
        price,
        description,
        seller,
        category,
        images,
      });

      await product.save();

      res.json({
        ok: true,
        product,
      });
    } catch (err) {
      respondWithErrorMessage(res, err, 500);
    }
  });

module.exports = currentRoute;
