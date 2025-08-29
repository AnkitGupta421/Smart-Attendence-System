const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, faceImageUrl } = req.body;

    const user = new User({ name, email, faceImageUrl });
    await user.save();

    res.json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
