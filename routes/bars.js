const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const cors = require("cors");

const User = require("../models/User");
const Bar = require("../models/Bar");

router.use(cors());

//@route  GET api/bars/
//@desc   Get current users bars
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

//@route  POST api/bars/
//@desc   Create a new bar
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
      let newBar = await Bar.query().where("barname", req.body);
      if (newBar) {
        return res.status(400).json({ msg: "bar name already used" });
      }
      newBar = req.body;
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

//@route  PATCH api/bars/:bar_id
//@desc   Edit bar name
//@access Private

router.patch("/:bar_id", auth, async (req, res) => {
  try {
    const user = await User.query().findById(req.user.id);

    const bar = await user
      .$relatedQuery("bars")
      .patchAndFetchById(req.params.bar_id, req.body);
    if (!bar) {
      return res
        .status(400)
        .json({ msg: "You don't have permission to edit this bar!" });
    }
    res.send(bar);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  DELETE api/bars/:bar_id
//@desc   Delete bar
//@access Private

router.delete("/:bar_id", auth, async (req, res) => {
  try {
    const user = await User.query().findById(req.user.id);
    const bar = await user.$relatedQuery("bars").deleteById(req.params.bar_id);
    if (!bar) {
      res
        .status(400)
        .json({ msg: "You don't have permission to delete this bar" });
    }
    res.redirect("/api/bars");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
