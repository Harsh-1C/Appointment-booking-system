const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const {
  handleGetDoctorInfo,
  handleUpdateProfile,
  handleGetSingleDoctor,
  handleGetDoctorAppointment,
  handleChangeStatus
} = require("../controllers/doctorCtrl");

// GET || Get doctor info by userid
router.get("/getDoctorInfo", authMiddleware, handleGetDoctorInfo);

// POST || Update doctor profile
router.post("/updateProfile", authMiddleware, handleUpdateProfile);

// POST || get doctor info by doctorid
router.post("/getSingleDoctor", authMiddleware, handleGetSingleDoctor);
router.post("/updateProfile", authMiddleware, handleUpdateProfile);

// GET || get doctor info by doctorid
router.get("/doctor-appointment", authMiddleware, handleGetDoctorAppointment);

// POST || CHANGE STATUS OF APPOINTMENT

router.post("/change-status", authMiddleware, handleChangeStatus);


module.exports = router;
