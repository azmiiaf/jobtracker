const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cvRoutes = require("./routes/cvRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
  }),
);
app.use(express.json());

// API Routes
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cvs", cvRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API Job Tracker siap digunakan.");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
