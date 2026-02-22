const router = require("express").Router()
const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")

router.post("/login", async(req,res)=>{

  const {username,password} = req.body

  const admin = await Admin.findOne({username})
  if(!admin) return res.status(401).send("No user")

  const match = await bcrypt.compare(password,admin.password)
  if(!match) return res.status(401).send("Wrong password")

  res.json({success:true})
})

module.exports = router