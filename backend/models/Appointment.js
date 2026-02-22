const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema(
{
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
    index: true
  },

  patientName: {
    type: String,
    required: true,
    trim: true
  },

  // format YYYY-MM-DD
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
    index: true
  },

  // format HH:mm เช่น 09:00
  time: {
    type: String,
    required: true,
    match: /^\d{2}:\d{2}$/,
    index: true
  },

  status: {
    type: String,
    enum: ["booked", "cancelled"],
    default: "booked"
  }
},
{ timestamps: true }
)


//ป้องกันจองซ้ำ doctor + date + time
appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  { unique: true }
)

module.exports = mongoose.model("Appointment", appointmentSchema)