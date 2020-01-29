const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const request = require("request");
const cors = require("cors");

const User = require("../models/User");
const Bar = require("../models/Bar");

router.use(cors());

//@route Get api/bars/me
//@desc Get current users bars
//@access Private

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.query()
      .findById(req.user.id)
      .select("username", "email")
      .withGraphFetched("[bars]");
    if (!user) {
      return res.status(400).json({ msg: "no bars found" });
    }
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route Post api/bars/
//@desc Create a new bar
//@access Private

router.post(
  "/",
  [
    auth,
    [
      check("barname", "Bar Name is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newBar = req.body;
      const user = await User.query().findById(req.user.id);

      const bar = await user
        .$relatedQuery("bars")
        .allowGraph("barname")
        .insert(newBar);

      res.send(bar);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
