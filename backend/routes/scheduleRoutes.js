const express = require("express")
const router = express.Router()

const Schedule = require("../models/Schedule")


/* =========================
   GET BY DOCTOR
========================= */
router.get("/", async (req,res)=>{
  try{

    const { doctorId } = req.query

    if(!doctorId){
      return res.status(400).json({message:"doctorId required"})
    }

    const data = await Schedule
      .find({ doctor: doctorId })
      .sort({ date:1, time:1 })

    res.json(data)

  }catch(err){
    res.status(500).json({error:err.message})
  }
})


/* =========================
   CREATE
========================= */
router.post("/", async (req,res)=>{
  try{

    const { doctorId, date, time } = req.body

    const newItem = await Schedule.create({
      doctor: doctorId,
      date,
      time
    })

    res.json(newItem)

  }catch(err){
    res.status(500).json({error:err.message})
  }
})


/* =========================
   UPDATE
========================= */
router.put("/:id", async (req,res)=>{
  try{

    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new:true }
    )

    res.json(updated)

  }catch(err){
    res.status(500).json({error:err.message})
  }
})


/* =========================
   DELETE
========================= */
router.delete("/:id", async (req,res)=>{
  try{

    await Schedule.findByIdAndDelete(req.params.id)
    res.json({message:"deleted"})

  }catch(err){
    res.status(500).json({error:err.message})
  }
})

module.exports = router