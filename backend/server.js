const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Serve Frontend (สำคัญมาก)
app.use(express.static(path.join(__dirname, "../frontend/public")))

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err))

// Routes
const doctorRoutes = require("./routes/doctorRoutes")
const appointmentRoutes = require("./routes/appointmentRoutes")
const adminAuthRoutes = require("./routes/adminAuthRoutes")

app.use("/api/doctors", doctorRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/admin", adminAuthRoutes)

// Test Route
app.get("/", (req, res) => {
  res.send("Doctor Booking API running")
})

// Server Start
const PORT = 5000
app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})