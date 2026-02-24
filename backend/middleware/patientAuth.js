const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

const patientAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const patient = await Patient.findById(decoded.id);
    if (!patient) {
      return res.status(401).json({ message: "Patient not found" });
    }

    req.patient = patient;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = patientAuth;