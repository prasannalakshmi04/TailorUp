const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

let bills = [];



// CREATE BILL
router.post("/create", async (req, res) => {
  const { items: usedItems } = req.body;

  let totalCost = 0; 
  for (let used of usedItems) {
        const item = await Item.findOne({ name: used.name });

        if (item) {
            item.quantity -= used.quantity;

            totalCost += item.price * used.quantity;

            await item.save();
        }
    }

  bills.push({
  items: usedItems,
  totalCost,
  date: new Date()
});

  res.json({
  message: "Bill created",
  totalCost
});
});

router.get("/stats", (req, res) => {
  const currentMonth = new Date().getMonth();

  const monthlyBills = bills.filter(bill => {
    return new Date(bill.date).getMonth() === currentMonth;
  });

  let totalRevenue = 0;

  monthlyBills.forEach(bill => {
    totalRevenue += bill.totalCost || 0;
  });

  res.json({
    totalOrders: monthlyBills.length,
    totalRevenue
  });
});

module.exports = router;