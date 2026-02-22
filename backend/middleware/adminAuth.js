const jwt = require("jsonwebtoken")

const SECRET = "supersecretkey"

module.exports = function(req,res,next){

  const token = req.headers.authorization

  if(!token)
    return res.status(401).json("Access denied")

  try{
    const verified = jwt.verify(token, SECRET)
    req.admin = verified
    next()
  }catch{
    res.status(400).json("Invalid token")
  }
}