const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

router.get("/", async (req, res) => {
  try {

    const totalAppointments = await Appointment.countDocuments();

    const totalPatients = await Appointment.distinct("patientPhone")
      .then(arr => arr.length);

    const completed = await Appointment.countDocuments({ status: "completed" });

    const attendanceRate = totalAppointments === 0
      ? 0
      : Math.round((completed / totalAppointments) * 100);

    const daily = await Appointment.aggregate([
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dailyBookings = daily.map(d => ({
      date: d._id,
      count: d.count
    }));

    res.json({
      totalPatients,
      totalAppointments,
      attendanceRate,
      dailyBookings
    });

  } catch (err) {
    res.status(500).json({ error: "Dashboard error" });
  }
});

module.exports = router;