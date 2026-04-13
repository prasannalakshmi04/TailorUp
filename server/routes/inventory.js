const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// ADD ITEM
router.post("/add", async (req, res) => {
  const { name, quantity, price } = req.body;

  const item = new Item({
    name,
    quantity: Number(quantity),
    price: Number(price)
  });

  await item.save();

  res.json({ message: "Item added" });
});

// GET ITEMS
router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

module.exports = router;