const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const cors = require("cors");

const User = require("../models/User");

router.use(cors());

//@route GET /users
//@desc See all users
//@access Public for now, will change to private

router.get("/", async (req, res) => {
  try {
    const users = await User.query().withGraphFetched("[bars]");
    // .select("username", "email", "id");
    res.send(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/users
//@desc Register a new user
//@access Public

router.post(
  "/",
  [
    check("username", "Username is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email address.").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    try {
      let user = await User.query().findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      user = { username, email, password };
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await User.query().insert(user);

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 360000 },
        (err, token) => {
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
