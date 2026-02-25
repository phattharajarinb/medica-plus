const express = require("express")
const router = express.Router()

const Appointment = require("../models/Appointment")
const Doctor = require("../models/Doctor")

// CREATE APPOINTMENT
router.post("/", async (req, res) => {
  try {

    const { doctor, date, time, patientName, patientPhone, appointmentType } = req.body

    if (!doctor || !date || !time || !patientName || !appointmentType) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const doc = await Doctor.findById(doctor)
    if (!doc) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    const dayName = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase()

    const daySchedule = doc.schedule?.[dayName] || []

    if (!daySchedule.includes(time)) {
      return res.status(400).json({
        message: `Doctor not available on ${dayName} at ${time}`
      })
    }

    const existing = await Appointment.findOne({
      doctor,
      date,
      time,
      status: "booked"
    })

    if (existing) {
      return res.status(400).json({
        message: "Time slot already booked"
      })
    }

    const appointment = await Appointment.create({
      doctor,
      date,
      time,
      patientName,
      patientPhone,
      appointmentType,
      status: "booked"
    })

    res.status(201).json(appointment)

  } catch (err) {

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Time slot already booked"
      })
    }

    res.status(500).json({ error: err.message })
  }
})

// GET ALL APPOINTMENTS
router.get("/", async (req, res) => {
  try {
    const data = await Appointment
      .find() // ถ้าอยากไม่แสดง cancelled ให้ใส่ { status:"booked" }
      .populate("doctor")
      .sort({ date: 1, time: 1 })

    res.json(data)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET APPOINTMENTS BY DOCTOR + DATE
router.get("/by-doctor", async (req, res) => {
  try {

    const { doctor, date } = req.query

    if (!doctor || !date) {
      return res.status(400).json({
        message: "doctor and date required"
      })
    }

    const data = await Appointment.find({
      doctor,
      date,
      status: "booked"
    })

    res.json(data)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET AVAILABLE SLOTS
router.get("/available-slots", async (req, res) => {
  try {

    const { doctor, date } = req.query

    if (!doctor || !date) {
      return res.status(400).json({
        message: "doctor and date required"
      })
    }

    const doc = await Doctor.findById(doctor)
    if (!doc) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    const dayName = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase()

    const daySchedule = doc.schedule?.[dayName] || []

    const booked = await Appointment.find({
      doctor,
      date,
      status: "booked"
    })

    const bookedTimes = booked.map(b => b.time)

    const available = daySchedule.filter(
      slot => !bookedTimes.includes(slot)
    )

    res.json({
      doctor: doc.name,
      date,
      day: dayName,
      availableSlots: available
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// UPDATE APPOINTMENT
router.put("/:id", async (req, res) => {
  try {

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({
        message: "Appointment not found"
      })
    }

    res.json(updated)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put("/:id/cancel", async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Not found" });

  appointment.status = "cancelled";
  await appointment.save();

  res.json({ message: "Appointment cancelled" });
});

// DELETE APPOINTMENT (HARD DELETE)
router.delete("/:id", async (req, res) => {
  try {

    const deleted = await Appointment.findByIdAndDelete(req.params.id)

    if (!deleted) {
      return res.status(404).json({
        message: "Appointment not found"
      })
    }

    res.json({ message: "Appointment deleted permanently" })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET MY APPOINTMENTS
router.get("/my/:phone", async (req, res) => {
  try {

    const { phone } = req.params

    const data = await Appointment.find({
      patientPhone: phone
    })
    .populate("doctor")
    .sort({ date: 1, time: 1 })

    res.json(data)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body)
    await newAppointment.save()

    res.status(201).json({ message: "จองสำเร็จ" })
  } catch (err) {

    // ดักกรณีจองซ้ำ
    if (err.code === 11000) {
      return res.status(400).json({
        message: "เวลานี้ถูกจองไปแล้ว กรุณาเลือกเวลาอื่น"
      })
    }

    res.status(500).json({ message: "เกิดข้อผิดพลาด" })
  }
})

module.exports = router