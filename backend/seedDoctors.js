const mongoose = require("mongoose")
const Doctor = require("./models/Doctor")

mongoose.connect("mongodb://127.0.0.1:27017/clinic")

async function seed(){

  await Doctor.deleteMany()

  await Doctor.insertMany([

    {
      name: "Dr. Anan Wong",
      specialization: "Cardiology",
      schedule: {
        monday: ["09:00","10:00","11:00"],
        tuesday: ["13:00","14:00"],
        wednesday: ["09:00","10:00"],
        thursday: [],
        friday: ["15:00","16:00"],
        saturday: [],
        sunday: []
      }
    },

    {
      name: "Dr. Suda Chai",
      specialization: "Dermatology",
      schedule: {
        monday: ["10:00","11:00"],
        tuesday: [],
        wednesday: ["13:00","14:00","15:00"],
        thursday: ["09:00"],
        friday: [],
        saturday: [],
        sunday: []
      }
    }

  ])

  console.log("Seed success")
  process.exit()
}

seed()