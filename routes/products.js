const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const cors = require("cors");

const User = require("../models/User");
const Bar = require("../models/Bar");
const Product = require("../models/Product");

router.use(cors());

//@route  GET api/products/:bar_id/
//@desc   Get current bars products
//@access Private

router.get("/:bar_id", auth, async (req, res) => {
  try {
    const user = await User.query().findById(req.user.id);
    let bar = await user.$relatedQuery("bars").where("id", req.params.bar_id);

    if (bar.length === 0) {
      return res
        .status(400)
        .json({ msg: "You don't have permission to view that bar" });
    }
    bar = await Bar.query()
      .findById(req.params.bar_id)
      .withGraphFetched("[products]");

    res.send(bar.products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  POST api/products/:bar_id/
//@desc   add a product to current bar inv
//@access Private

router.post(
  "/:bar_id",
  [
    auth,
    [
      check("productname", "Product Name is required")
        .not()
        .isEmpty(),
      check("category", "Category is required")
        .not()
        .isEmpty(),
      check("size", "Bottle size is required")
        .not()
        .isEmpty(),
      check("price", "Price is required")
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
      const user = await User.query().findById(req.user.id);
      let bar = await user.$relatedQuery("bars").where("id", req.params.bar_id);

      if (bar.length === 0) {
        return res
          .status(400)
          .json({ msg: "You don't have permission to add to that bar" });
      }
      bar = await Bar.query()
        .findById(req.params.bar_id)
        .withGraphFetched("[products]");

      await bar
        .$relatedQuery("products")
        .allowGraph("[productname, category, size, price]")
        .insert(req.body);

      res.send(bar.products);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  PATCH api/products/:bar_id/:product_id
//@desc   edit a product in current bar inv
//@access Private

router.patch("/:bar_id/:product_id", auth, async (req, res) => {
  try {
    const user = await User.query().findById(req.user.id);
    let bar = await user.$relatedQuery("bars").where("id", req.params.bar_id);

    if (bar.length === 0) {
      return res
        .status(400)
        .json({ msg: "You don't have permission to edit that bar" });
    }

    bar = await Bar.query()
      .findById(req.params.bar_id)
      .withGraphFetched("[products]");

    let product = await bar
      .$relatedQuery("products")
      .where("id", req.params.product_id);

    if (product.length === 0) {
      return res
        .status(400)
        .json({ msg: "You don't have permission to edit that product" });
    }
    product = await Product.query().patchAndFetchById(
      req.params.product_id,
      req.body
    );

    res.send(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  DELETE api/products/:bar_id/:product_id
//@desc   delete a product from current bar inv
//@access Private

router.delete("/:bar_id/:product_id", auth, async (req, res) => {
  try {
    const user = await User.query().findById(req.user.id);
    let bar = await user.$relatedQuery("bars").where("id", req.params.bar_id);

    if (bar.length === 0) {
      return res
        .status(400)
        .json({ msg: "You don't have permission to edit that bar" });
    }

    bar = await Bar.query()
      .findById(req.params.bar_id)
      .withGraphFetched("[products]");

    let product = await bar
      .$relatedQuery("products")
      .where("id", req.params.product_id);

    if (product.length === 0) {
      return res
        .status(400)
        .json({ msg: "You don't have permission to delete that product" });
    }
    product = await Product.query().deleteById(req.params.product_id);

    res.redirect(`/api/products/${req.params.bar_id}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
