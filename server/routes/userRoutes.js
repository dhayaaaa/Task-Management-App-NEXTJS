const express = require("express");
const router = express.Router();
const { UserModel } = require("../models/User");

// GET /api/allusers
router.get("/allusers", async (req, res) => {
  try {
    const users = await UserModel.find({}, "name email"); 
    res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
});

module.exports = router;
