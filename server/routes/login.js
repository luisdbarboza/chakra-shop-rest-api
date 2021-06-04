const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const { respondWithErrorMessage } = require("../helpers/helpers");

const currentRoute = express.Router();

currentRoute.route("/").post(async (req, res) => {
  const invalidCredentialError = "email o password incorrectos";

  try {
    const { email, password } = req.body;

    let found = await User.find({ email });
    const isPasswordValid = await bcrypt.compare(password, found[0].password);

    if (found.length === 0 || !isPasswordValid) {
      throw new Error(invalidCredentialError);
    } else {
      found = found[0];

      const token = jwt.sign(
        {
          user: found,
        },
        process.env.SEED,
        { expiresIn: "365d" }
      );

      res.json({
        ok: true,
        user: found,
        token,
      });
    }
  } catch (err) {
    console.log(err);

    if (err.message === invalidCredentialError) {
      const customError = {
        message: invalidCredentialError,
      };

      res.status(401).json({
        ok: false,
        err: customError,
      });
    } else {
      respondWithErrorMessage(res, err, 500);
    }
  }
});

module.exports = currentRoute;
