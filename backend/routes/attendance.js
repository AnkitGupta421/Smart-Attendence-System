const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// Mark Attendance
router.post("/mark", async (req, res) => {
  try {
    const { userId, photoUrl } = req.body;

    const attendance = new Attendance({ user: userId, photoUrl });
    await attendance.save();

    res.json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Attendance Records
//  Get all attendance records (optionally filter by date)
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      query.date = { $gte: start, $lt: end };
    }

    const records = await Attendance.find(query)
      .populate("user", "name email")
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
