const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.use(cors());

router.get("/", async (req, res) => {
  try {
    const users = await User.query();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
