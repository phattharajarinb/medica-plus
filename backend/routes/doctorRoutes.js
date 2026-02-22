const express = require("express")
const router = express.Router()

const Doctor = require("../models/Doctor")
const Appointment = require("../models/Appointment")


// สร้างแพทย์ใหม่
router.post("/", async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body)
    res.json(doctor)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ดึงรายชื่อแพทย์ทั้งหมด
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 })
    res.json(doctors)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ดึงข้อมูลแพทย์ตาม id
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ message: "Doctor not found" })
    res.json(doctor)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ดึงตารางเวลาทั้งหมดของแพทย์
router.get("/:id/schedule", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ message: "Doctor not found" })

    res.json(doctor.schedule || {})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// บันทึกตารางเวลาใหม่ (overwrite ทั้งตาราง)
router.put("/:id/schedule", async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      { schedule: req.body },
      { new: true }
    )

    if (!updated) return res.status(404).json({ message: "Doctor not found" })

    res.json(updated.schedule)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// เช็คเวลาว่างของแพทย์ในวันที่เลือก
router.get("/:id/slots", async (req, res) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ message: "Date required" })

    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) return res.status(404).json({ message: "Doctor not found" })

    // แปลงวันที่เป็นชื่อวัน เช่น monday
    const dayName = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase()

    // ตารางเวลาที่แพทย์ทำงานวันนั้น
    const daySchedule = doctor.schedule?.[dayName] || []

    // เวลาที่ถูกจองแล้ว
    const booked = await Appointment.find({
      doctor: req.params.id,
      date,
      status: "booked"
    })

    const bookedTimes = booked.map(b => b.time)

    // เวลาที่เหลือจองได้
    const available = daySchedule.filter(
      t => !bookedTimes.includes(t)
    )

    res.json({
      doctor: doctor.name,
      date,
      day: dayName,
      totalSlots: daySchedule.length,
      booked: bookedTimes,
      available
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// แก้ไขข้อมูลแพทย์ทั่วไป (ชื่อ / สาขา)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!updated) return res.status(404).json({ message: "Doctor not found" })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// ลบแพทย์
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Doctor not found" })

    res.json({ message: "Doctor deleted" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router