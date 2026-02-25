const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Frontend (สำคัญ)
app.use(express.static(path.join(__dirname, "../frontend/public")));

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// Routes
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const patientAuthRoutes = require("./routes/patientAuthRoutes"); 
const dashboardRoutes = require("./routes/dashboard");

app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/patient", patientAuthRoutes); 
app.use("/api/dashboard", dashboardRoutes);

// Test Route
app.get("/api", (req, res) => {
  res.json({ message: "Doctor Booking API running" });
});

// Error Handler (optional แต่ดีมาก)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});