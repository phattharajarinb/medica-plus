const mongoose = require("mongoose")

const DoctorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  specialization: {
    type: String,
    required: true
  },

  schedule: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String],
    saturday: [String],
    sunday: [String]
  }

}, { timestamps: true })

module.exports = mongoose.model("Doctor", DoctorSchema)