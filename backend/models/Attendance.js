const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  photoUrl: {
    type: String, // S3 URL or local path for proof
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
