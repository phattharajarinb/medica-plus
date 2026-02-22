require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Admin = require("./models/Admin")

mongoose.connect(process.env.MONGO_URI)

async function seedAdmin(){

  const exist = await Admin.findOne({ username:"admin" })
  if(exist){
    console.log("Admin already exists")
    process.exit()
  }

  const hashed = await bcrypt.hash("123456",10)

  await Admin.create({
    username:"admin",
    email:"admin@hospital.com",  
    password:hashed
  })

  console.log("Admin created successfully")
  process.exit()
}

seedAdmin()