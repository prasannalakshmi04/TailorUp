const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("INDEX FILE RUNNING");

// ✅ CREATE APP FIRST
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Import routes AFTER app created
const authRoutes = require("./routes/auth");

console.log("AuthRoutes:", authRoutes);

// ✅ Use routes AFTER app exists
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
    res.send("Server running 🚀");
});

const inventoryRoutes = require("./routes/inventory");

app.use("/api/inventory", inventoryRoutes);

const billingRoutes = require("./routes/billing");

app.use("/api/billing", billingRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log(err));

// start server
app.listen(8000, () => {
    console.log("Server running on port 8000 🚀");
});