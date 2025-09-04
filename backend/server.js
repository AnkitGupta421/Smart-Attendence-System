// 1. Load environment variables
require("dotenv").config();

// 2. Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 3. Initialize express app
const app = express();

// 4. Middleware
app.use(cors());
app.use(express.json());

// 5. Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));

// 6. Connect to MongoDB and Start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    // no need for useNewUrlParser/unifiedTopology (deprecated in v6+)
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit if DB not connected
  });
