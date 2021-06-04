const express = require("express");
const currentRoute = express.Router();
const Category = require("../models/categories");
const Product = require("../models/products");
const { respondWithErrorMessage } = require("../helpers/helpers");

currentRoute
  .route("/")
  .get(async (req, res) => {
    try {
      const categories = await Category.find({});

      res.json({
        ok: true,
        categories,
      });
    } catch (err) {
      respondWithErrorMessage(res, err, 500);
    }
  })
  .post(async (req, res) => {
    try {
      const { name } = req.body;

      const category = new Category({
        name,
      });

      await category.save();

      res.json({
        ok: true,
        category,
      });
    } catch (err) {
      respondWithErrorMessage(res, err, 500);
    }
  });

module.exports = currentRoute;
