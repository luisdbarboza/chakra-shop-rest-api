const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const currentRoute = express.Router();
const User = require("../models/users");
const { respondWithErrorMessage } = require("../helpers/helpers");

currentRoute
  .route("/")
  .get((req, res) => {
    res.send("All users");
  })
  .post(async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const saltRounds = 10;
      let hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      await user.save();

      res.json({
        ok: true,
        user,
      });
    } catch (err) {
      respondWithErrorMessage(res, err, 500);
    }
  });

module.exports = currentRoute;
